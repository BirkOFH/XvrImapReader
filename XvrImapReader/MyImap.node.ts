import {
    INodeType,
    INodeTypeDescription,
    IExecuteFunctions,
    INodeExecutionData,
    ILoadOptionsFunctions,
    INodePropertyOptions,
    NodeOperationError,
} from 'n8n-workflow';

import { ImapService, ImapConfig, FetchOptions } from './ImapService';

export class XvrAdvancedImap implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Xvr Advanced IMAP',
        name: 'xvrAdvancedImap',
        icon: 'fa:envelope',
        group: ['input'],
        version: 1,
        subtitle: '={{$parameter["operation"]}}',
        description: 'Advanced IMAP client with full attachment support',
        defaults: {
            name: 'Xvr Advanced IMAP',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'xvrImapCredentials',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Fetch Emails',
                        value: 'fetchEmails',
                        description: 'Fetch emails from mailbox',
                        action: 'Fetch emails from mailbox',
                    },
                    {
                        name: 'Get Folders',
                        value: 'getFolders',
                        description: 'Get list of available folders',
                        action: 'Get list of available folders',
                    },
                ],
                default: 'fetchEmails',
            },

            // Fetch Emails options
            {
                displayName: 'Mailbox Name',
                name: 'mailbox',
                type: 'string',
                displayOptions: {
                    show: {
                        operation: ['fetchEmails'],
                    },
                },
                default: 'INBOX',
                required: true,
                description: 'The mailbox to fetch emails from (e.g., INBOX, Sent, Drafts)',
            },
            {
                displayName: 'Read Status',
                name: 'readStatus',
                type: 'options',
                displayOptions: {
                    show: {
                        operation: ['fetchEmails'],
                    },
                },
                options: [
                    {
                        name: 'All',
                        value: 'all',
                    },
                    {
                        name: 'Unread Only',
                        value: 'unread',
                    },
                    {
                        name: 'Read Only',
                        value: 'read',
                    },
                ],
                default: 'all',
                description: 'Filter emails by read status',
            },
            {
                displayName: 'Limit',
                name: 'limit',
                type: 'number',
                displayOptions: {
                    show: {
                        operation: ['fetchEmails'],
                    },
                },
                default: 10,
                typeOptions: {
                    minValue: 1,
                    maxValue: 1000,
                },
                description: 'Maximum number of emails to fetch',
            },
            {
                displayName: 'Data to Fetch',
                name: 'dataToFetch',
                type: 'options',
                displayOptions: {
                    show: {
                        operation: ['fetchEmails'],
                    },
                },
                options: [
                    {
                        name: 'Metadata Only',
                        value: 'metadata',
                        description: 'Only subject, from, to, date',
                    },
                    {
                        name: 'Metadata + Body',
                        value: 'body',
                        description: 'Include email body (text and HTML)',
                    },
                    {
                        name: 'Full (with Attachments)',
                        value: 'full',
                        description: 'Include body and attachments as binary data',
                    },
                ],
                default: 'body',
                description: 'What data to download from emails',
            },
            {
                displayName: 'Mark as Read',
                name: 'markAsRead',
                type: 'boolean',
                displayOptions: {
                    show: {
                        operation: ['fetchEmails'],
                    },
                },
                default: false,
                description: 'Whether to mark fetched emails as read',
            },

            // Additional options
            {
                displayName: 'Additional Options',
                name: 'additionalOptions',
                type: 'collection',
                placeholder: 'Add Option',
                displayOptions: {
                    show: {
                        operation: ['fetchEmails'],
                    },
                },
                default: {},
                options: [
                    {
                        displayName: 'From Filter',
                        name: 'fromFilter',
                        type: 'string',
                        default: '',
                        description: 'Filter emails by sender address (e.g., sender@example.com)',
                    },
                    {
                        displayName: 'Subject Filter',
                        name: 'subjectFilter',
                        type: 'string',
                        default: '',
                        description: 'Filter emails by subject text',
                    },
                ],
            },
        ],
    };

    methods = {
        loadOptions: {
            async getMailboxes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
                const credentials = await this.getCredentials('xvrImapCredentials');

                const config: ImapConfig = {
                    host: credentials.host as string,
                    port: credentials.port as number,
                    user: credentials.user as string,
                    password: credentials.password as string,
                    tls: credentials.tls as boolean,
                    tlsOptions: {
                        rejectUnauthorized: !(credentials.allowUnauthorizedCerts as boolean),
                    },
                };

                const imapService = new ImapService(config);

                try {
                    const folders = await imapService.getFolderList();
                    await imapService.disconnect();

                    return folders.map((folder) => ({
                        name: folder,
                        value: folder,
                    }));
                } catch (error) {
                    throw new NodeOperationError(
                        this.getNode(),
                        `Failed to load mailboxes: ${(error as Error).message}`,
                    );
                }
            },
        },
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];
        const operation = this.getNodeParameter('operation', 0) as string;

        // Get credentials
        const credentials = await this.getCredentials('xvrImapCredentials');

        const config: ImapConfig = {
            host: credentials.host as string,
            port: credentials.port as number,
            user: credentials.user as string,
            password: credentials.password as string,
            tls: credentials.secure as boolean,
            tlsOptions: {
                rejectUnauthorized: credentials.allowUnauthorized === false,
            },
        };

        const imapService = new ImapService(config);

        try {
            if (operation === 'getFolders') {
                // Get folder list
                const folders = await imapService.getFolderList();
                
                for (const folder of folders) {
                    returnData.push({
                        json: {
                            folder: folder,
                        },
                    });
                }
            } else if (operation === 'fetchEmails') {
                // Fetch emails
                const mailbox = this.getNodeParameter('mailbox', 0) as string;
                const readStatus = this.getNodeParameter('readStatus', 0) as string;
                const limit = this.getNodeParameter('limit', 0) as number;
                const dataToFetch = this.getNodeParameter('dataToFetch', 0) as string;
                const markAsRead = this.getNodeParameter('markAsRead', 0) as boolean;
                const additionalOptions = this.getNodeParameter('additionalOptions', 0, {}) as any;

                // Build search criteria
                const searchCriteria: any[] = [];
                
                if (readStatus === 'unread') {
                    searchCriteria.push('UNSEEN');
                } else if (readStatus === 'read') {
                    searchCriteria.push('SEEN');
                } else {
                    searchCriteria.push('ALL');
                }

                if (additionalOptions.fromFilter) {
                    searchCriteria.push('FROM', additionalOptions.fromFilter);
                }

                if (additionalOptions.subjectFilter) {
                    searchCriteria.push('SUBJECT', additionalOptions.subjectFilter);
                }

                const fetchOptions: FetchOptions = {
                    folder: mailbox,
                    limit: limit,
                    downloadBody: dataToFetch !== 'metadata',
                    downloadAttachments: dataToFetch === 'full',
                    searchCriteria: searchCriteria,
                    markAsRead: markAsRead,
                };

                const emails = await imapService.fetchEmails(fetchOptions);

                for (const email of emails) {
                    const item: INodeExecutionData = {
                        json: {
                            uid: email.uid,
                            subject: email.subject,
                            from: email.from,
                            to: email.to,
                            date: email.date,
                            textBody: email.textBody,
                            htmlBody: email.htmlBody,
                            attachmentCount: email.attachments?.length || 0,
                        },
                        binary: {},
                    };

                    // Add attachments as binary data
                    if (email.attachments && email.attachments.length > 0) {
                        for (let i = 0; i < email.attachments.length; i++) {
                            const attachment = email.attachments[i];
                            if (attachment) {
                                item.binary![`attachment_${i}`] = {
                                    data: attachment.data.toString('base64'),
                                    mimeType: attachment.mimeType,
                                    fileName: attachment.filename,
                                };
                            }
                        }
                    }

                    returnData.push(item);
                }
            }

            return [returnData];
        } finally {
            await imapService.disconnect();
        }
    }
}
