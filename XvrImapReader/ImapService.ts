import * as imaps from 'imap-simple';
import { simpleParser, ParsedMail, Attachment } from 'mailparser';

export interface ImapConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    tls: boolean;
    tlsOptions?: {
        rejectUnauthorized: boolean;
    };
}

export interface FetchOptions {
    folder: string;
    limit: number;
    downloadBody: boolean;
    downloadAttachments: boolean;
    searchCriteria: any[];
    markAsRead: boolean;
}

export interface EmailData {
    uid: number;
    subject: string;
    from: string;
    to: string;
    date: Date;
    textBody?: string;
    htmlBody?: string;
    attachments?: Array<{
        filename: string;
        mimeType: string;
        data: Buffer;
        size: number;
    }>;
}

export class ImapService {
    private config: ImapConfig;
    private connection: any = null;

    constructor(config: ImapConfig) {
        this.config = config;
    }

    private async connect(): Promise<any> {
        if (this.connection) {
            return this.connection;
        }

        const connectionConfig = {
            imap: {
                user: this.config.user,
                password: this.config.password,
                host: this.config.host,
                port: this.config.port,
                tls: this.config.tls,
                tlsOptions: this.config.tlsOptions || { rejectUnauthorized: false },
                authTimeout: 10000,
            },
        };

        this.connection = await imaps.connect(connectionConfig);
        return this.connection;
    }

    async disconnect(): Promise<void> {
        if (this.connection) {
            await this.connection.end();
            this.connection = null;
        }
    }

    async getFolderList(): Promise<string[]> {
        try {
            const connection = await this.connect();
            const boxes = await connection.getBoxes();
            
            const folders: string[] = [];
            this.flattenBoxes(boxes, '', folders);
            
            return folders;
        } catch (error) {
            throw new Error(`Failed to get folder list: ${(error as Error).message}`);
        }
    }

    private flattenBoxes(boxes: any, parentPath: string, result: string[]): void {
        for (const [name, box] of Object.entries(boxes)) {
            const currentPath = parentPath ? `${parentPath}/${name}` : name;
            result.push(currentPath);

            if (box && typeof box === 'object' && (box as any).children) {
                this.flattenBoxes((box as any).children, currentPath, result);
            }
        }
    }

    async fetchEmails(options: FetchOptions): Promise<EmailData[]> {
        try {
            const connection = await this.connect();
            
            await connection.openBox(options.folder);

            const searchCriteria = options.searchCriteria.length > 0 
                ? options.searchCriteria 
                : ['ALL'];

            const fetchOptions = {
                bodies: options.downloadBody ? ['HEADER', 'TEXT', ''] : ['HEADER'],
                markSeen: false,
            };

            const messages = await connection.search(searchCriteria, fetchOptions);

            const limitedMessages = options.limit > 0 
                ? messages.slice(0, options.limit) 
                : messages;

            const emails: EmailData[] = [];

            for (const message of limitedMessages) {
                const emailData = await this.parseMessage(message, options);
                emails.push(emailData);

                if (options.markAsRead) {
                    await this.markMessageAsRead(connection, message);
                }
            }

            return emails;
        } catch (error) {
            throw new Error(`Failed to fetch emails: ${(error as Error).message}`);
        }
    }

    private async parseMessage(message: any, options: FetchOptions): Promise<EmailData> {
        const all = message.parts.find((part: any) => part.which === '');
        const header = message.parts.find((part: any) => part.which === 'HEADER');

        let parsed: ParsedMail | null = null;

        if (all) {
            parsed = await simpleParser(all.body);
        } else if (header) {
            parsed = await simpleParser(header.body);
        }

        const getAddressText = (address: any): string => {
            if (!address) return 'Unknown';
            if (typeof address === 'string') return address;
            if (address.text) return address.text;
            if (Array.isArray(address) && address.length > 0) {
                return address.map(a => a.text || a.address || '').join(', ');
            }
            return address.address || 'Unknown';
        };

        const emailData: EmailData = {
            uid: message.attributes.uid,
            subject: parsed?.subject || 'No Subject',
            from: getAddressText(parsed?.from),
            to: getAddressText(parsed?.to),
            date: parsed?.date || new Date(),
        };

        if (options.downloadBody && parsed) {
            emailData.textBody = parsed.text || '';
            emailData.htmlBody = parsed.html || '';
        }

        if (options.downloadAttachments && parsed?.attachments) {
            emailData.attachments = parsed.attachments.map((att: Attachment) => ({
                filename: att.filename || 'unknown',
                mimeType: att.contentType,
                data: att.content,
                size: att.size,
            }));
        }

        return emailData;
    }

    private async markMessageAsRead(connection: any, message: any): Promise<void> {
        try {
            await connection.addFlags(message.attributes.uid, '\\Seen');
        } catch (error) {
            console.warn(`Failed to mark message as read: ${(error as Error).message}`);
        }
    }

    async testConnection(): Promise<boolean> {
        try {
            await this.connect();
            await this.disconnect();
            return true;
        } catch (error) {
            return false;
        }
    }
}
