import {
    IExecuteFunctions,
    ILoadOptionsFunctions,
    INodeExecutionData,
    INodePropertyOptions,
    INodeType,
    INodeTypeDescription,
    NodeOperationError,
} from 'n8n-workflow';

import { ImapService, ImapConfig, FetchOptions } from './ImapService';

export class MyImap implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'My IMAP',
        name: 'myImap',
        icon: 'fa:envelope',
        group: ['input'],
        version: 1,
        subtitle: '={{$parameter["operation"]}}',
        description: 'Advanced IMAP email reader with attachment support',
        defaults: {
            name: 'My IMAP',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'myImapCredentials',
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
                        description: 'Retrieve emails from mailbox',
                        action: 'Fetch emails from mailbox',
                    },
                    {
                        name: 'Get Folders',
                        value: 'getFolders',
                        description: 'Get list of all mailbox folders',
                        action: 'Get list of mailbox folders',
                    },
                ],
                default: 'fetchEmails',
            },

            {
                displayName: 'Mailbox Name',
                name: 'mailbox',
                type: 'options',
                typeOptions: {
                    loadOptionsMethod: 'getMailboxes',
                },
                displayOptions: {
                    show: {
                        operation: ['fetchEmails'],
                    },
                },
                default: 'INBOX',
                required: true,
                description: 'The mailbox to read emails from',
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
                        description: 'Retrieve all emails',
                    },
                    {
                        name: 'Unread Only',
                        value: 'unread',
                        description: 'Retrieve only unread emails',
                    },
                    {
                        name: 'Read Only',
                        value: 'read',
                        description: 'Retrieve only read emails',
                    },
                ],
                default: 'unread',
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
                typeOptions: {
                    minValue: 1,
                    maxValue: 1000,
                },
                default: 10,
                description: 'Maximum number of emails to retrieve',
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
                        description: 'Subject, From, To, Date only',
                    },
                    {
                        name: 'Metadata + Body',
                        value: 'body',
                        description: 'Include email text and HTML body',
                    },
                    {
                        name: 'Full (with Attachments)',
                        value: 'full',
                        description: 'Include everything including attachments',
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
                description: 'Whether to mark emails as read after processing',
            },

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
                        placeholder: 'sender@example.com',
                        description: 'Filter emails by sender address',
                    },
                    {
                        displayName: 'Subject Filter',
                        name: 'subjectFilter',
                        type: 'string',
                        default: '',
                        placeholder: 'Invoice',
                        description: 'Filter emails by subject text',
                    },
                ],
            },
        ],
    };

    methods = {
        loadOptions: {
            async getMailboxes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
                const credentials = await this.getCredentials('myImapCredentials');

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

        const credentials = await this.getCredentials('myImapCredentials');

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
            if (operation === 'getFolders') {
                const folders = await imapService.getFolderList();

                for (const folder of folders) {
                    returnData.push({
                        json: {
                            folder,
                        },
                        pairedItem: { item: 0 },
                    });
                }
            } else if (operation === 'fetchEmails') {
                for (let i = 0; i < items.length; i++) {
                    const mailbox = this.getNodeParameter('mailbox', i) as string;
                    const readStatus = this.getNodeParameter('readStatus', i) as string;
                    const limit = this.getNodeParameter('limit', i) as number;
                    const dataToFetch = this.getNodeParameter('dataToFetch', i) as string;
                    const markAsRead = this.getNodeParameter('markAsRead', i) as boolean;
                    const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as any;

                    const searchCriteria: any[] = [];

                    if (readStatus === 'unread') {
                        searchCriteria.push('UNSEEN');
                    } else if (readStatus === 'read') {
                        searchCriteria.push('SEEN');
                    }

                    if (additionalOptions.fromFilter) {
                        searchCriteria.push('FROM', additionalOptions.fromFilter);
                    }

                    if (additionalOptions.subjectFilter) {
                        searchCriteria.push('SUBJECT', additionalOptions.subjectFilter);
                    }

                    if (searchCriteria.length === 0) {
                        searchCriteria.push('ALL');
                    }

                    const fetchOptions: FetchOptions = {
                        folder: mailbox,
                        limit,
                        downloadBody: dataToFetch === 'body' || dataToFetch === 'full',
                        downloadAttachments: dataToFetch === 'full',
                        searchCriteria,
                        markAsRead,
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
                            },
                            pairedItem: { item: i },
                        };

                        if (email.textBody !== undefined) {
                            item.json.textBody = email.textBody;
                        }

                        if (email.htmlBody !== undefined) {
                            item.json.htmlBody = email.htmlBody;
                        }

                        if (email.attachments && email.attachments.length > 0) {
                            item.binary = {};
                            email.attachments.forEach((attachment, index) => {
                                const binaryPropertyName = `attachment_${index}`;
                                item.binary![binaryPropertyName] = {
                                    data: attachment.data.toString('base64'),
                                    mimeType: attachment.mimeType,
                                    fileName: attachment.filename,
                                };
                            });

                            item.json.attachmentCount = email.attachments.length;
                        }

                        returnData.push(item);
                    }
                }
            }
        } catch (error) {
            throw new NodeOperationError(this.getNode(), `Error: ${(error as Error).message}`);
        } finally {
            await imapService.disconnect();
        }

        return [returnData];
    }
}
