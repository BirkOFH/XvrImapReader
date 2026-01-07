import {
    IAuthenticateGeneric,
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class MyImapCredentials implements ICredentialType {
    name = 'myImapCredentials';
    displayName = 'IMAP Credentials';
    documentationUrl = 'https://docs.n8n.io/credentials/';
    properties: INodeProperties[] = [
        {
            displayName: 'Host',
            name: 'host',
            type: 'string',
            default: '',
            placeholder: 'imap.example.com',
            required: true,
            description: 'IMAP server hostname',
        },
        {
            displayName: 'Port',
            name: 'port',
            type: 'number',
            default: 993,
            required: true,
            description: 'IMAP server port (usually 993 for SSL/TLS)',
        },
        {
            displayName: 'User',
            name: 'user',
            type: 'string',
            default: '',
            placeholder: 'user@example.com',
            required: true,
            description: 'Email address or username',
        },
        {
            displayName: 'Password',
            name: 'password',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
            required: true,
            description: 'Email account password',
        },
        {
            displayName: 'Use TLS',
            name: 'tls',
            type: 'boolean',
            default: true,
            description: 'Whether to use TLS/SSL encryption',
        },
        {
            displayName: 'Allow Unauthorized Certificates',
            name: 'allowUnauthorizedCerts',
            type: 'boolean',
            default: false,
            description: 'Whether to allow unauthorized/self-signed certificates',
        },
    ];

    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {},
    };

    test: ICredentialTestRequest = {
        request: {
            baseURL: '={{$credentials.host}}',
            url: '',
        },
    };
}
