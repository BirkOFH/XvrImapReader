import {
    IAuthenticateGeneric,
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class XvrImapCredentials implements ICredentialType {
    name = 'xvrImapCredentials';
    displayName = 'Xvr IMAP Credentials';
    documentationUrl = 'https://github.com/BirkOFH/XvrImapReader';
    properties: INodeProperties[] = [
        {
            displayName: 'Host',
            name: 'host',
            type: 'string',
            default: '',
            placeholder: 'imap.example.com',
            required: true,
        },
        {
            displayName: 'Port',
            name: 'port',
            type: 'number',
            default: 993,
            required: true,
        },
        {
            displayName: 'User',
            name: 'user',
            type: 'string',
            default: '',
            placeholder: 'user@example.com',
            required: true,
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
        },
        {
            displayName: 'Secure Connection (TLS)',
            name: 'secure',
            type: 'boolean',
            default: true,
            description: 'Whether to use TLS/SSL encryption',
        },
        {
            displayName: 'Allow Unauthorized Certificates',
            name: 'allowUnauthorized',
            type: 'boolean',
            default: true,
            description: 'Whether to allow connections with self-signed certificates',
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
