import { ImapFlow } from 'imapflow';
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
    private client: ImapFlow | null = null;

    constructor(config: ImapConfig) {
        this.config = config;
    }

    private async connect(): Promise<ImapFlow> {
        if (this.client) {
            return this.client;
        }

        this.client = new ImapFlow({
            host: this.config.host,
            port: this.config.port,
            secure: this.config.tls,
            auth: {
                user: this.config.user,
                pass: this.config.password,
            },
            tls: {
                rejectUnauthorized: this.config.tlsOptions?.rejectUnauthorized ?? false,
            },
            logger: false,
        });

        await this.client.connect();
        return this.client;
    }

    async disconnect(): Promise<void> {
        if (this.client) {
            try {
                await this.client.logout();
            } catch (error) {
                // Ignore errors when closing connection
            }
            this.client = null;
        }
    }

    async getFolderList(): Promise<string[]> {
        try {
            const client = await this.connect();
            const folders: string[] = [];
            
            // Get mailbox tree
            const mailboxes = await client.list();
            
            // Flatten the list
            for (const mailbox of mailboxes) {
                folders.push(mailbox.path);
            }
            
            return folders;
        } catch (error) {
            this.client = null;
            throw new Error(`Failed to get folder list: ${(error as Error).message}`);
        }
    }

    async fetchEmails(options: FetchOptions): Promise<EmailData[]> {
        try {
            const client = await this.connect();
            
            // Open mailbox
            const lock = await client.getMailboxLock(options.folder);
            
            try {
                // Build search criteria
                const searchCriteria = this.buildSearchCriteria(options.searchCriteria);
                
                // Search for messages (returns array of UIDs or false)
                const searchResult = await client.search(searchCriteria);
                const allUids = searchResult === false ? [] : searchResult;
                
                // Limit results
                const messageUids = options.limit > 0 
                    ? allUids.slice(0, options.limit) 
                    : allUids;

                const emails: EmailData[] = [];

                // Fetch each message
                for (const uid of messageUids) {
                    const message = await client.fetchOne(
                        String(uid),
                        {
                            source: options.downloadBody || options.downloadAttachments,
                            envelope: true,
                            bodyStructure: true,
                        }
                    );

                    const emailData = await this.parseMessage(message, options);
                    emails.push(emailData);

                    if (options.markAsRead) {
                        await client.messageFlagsAdd(String(uid), ['\\Seen']);
                    }
                }

                return emails;
            } finally {
                lock.release();
            }
        } catch (error) {
            this.client = null;
            throw new Error(`Failed to fetch emails: ${(error as Error).message}`);
        }
    }

    private buildSearchCriteria(criteria: any[]): any {
        if (!criteria || criteria.length === 0 || criteria[0] === 'ALL') {
            return { all: true };
        }

        const searchObj: any = {};

        for (let i = 0; i < criteria.length; i++) {
            const criterion = criteria[i];
            
            if (criterion === 'UNSEEN') {
                searchObj.unseen = true;
            } else if (criterion === 'SEEN') {
                searchObj.seen = true;
            } else if (criterion === 'FROM' && i + 1 < criteria.length) {
                searchObj.from = criteria[i + 1];
                i++;
            } else if (criterion === 'SUBJECT' && i + 1 < criteria.length) {
                searchObj.subject = criteria[i + 1];
                i++;
            }
        }

        return Object.keys(searchObj).length > 0 ? searchObj : { all: true };
    }

    private async parseMessage(message: any, options: FetchOptions): Promise<EmailData> {
        const envelope = message.envelope;
        
        let parsed: ParsedMail | null = null;

        // Parse message body if needed
        if (options.downloadBody || options.downloadAttachments) {
            if (message.source) {
                parsed = await simpleParser(message.source);
            }
        }

        const getAddressText = (address: any): string => {
            if (!address || address.length === 0) return 'Unknown';
            if (typeof address === 'string') return address;
            
            const first = address[0];
            if (first.address) {
                return first.name ? `${first.name} <${first.address}>` : first.address;
            }
            return 'Unknown';
        };

        const emailData: EmailData = {
            uid: message.uid,
            subject: envelope.subject || 'No Subject',
            from: getAddressText(envelope.from),
            to: getAddressText(envelope.to),
            date: envelope.date || new Date(),
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
