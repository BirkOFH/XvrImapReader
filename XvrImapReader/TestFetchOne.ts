import { config as loadEnv } from 'dotenv';

// Load environment variables from .env file
loadEnv();

import { ImapService, ImapConfig, FetchOptions } from './ImapService';

async function testFetchOne() {
    console.log('=== Fetch One Email Test ===\n');

    const imapConfig: ImapConfig = {
        host: process.env.IMAP_HOST || 'imap.example.com',
        port: parseInt(process.env.IMAP_PORT || '993'),
        user: process.env.IMAP_USER || 'your-email@example.com',
        password: process.env.IMAP_PASSWORD || 'your-password',
        tls: process.env.IMAP_TLS !== 'false',
        tlsOptions: {
            rejectUnauthorized: process.env.IMAP_REJECT_UNAUTHORIZED === 'true',
        },
    };

    console.log('Configuration:');
    console.log(`  Host: ${imapConfig.host}`);
    console.log(`  Port: ${imapConfig.port}`);
    console.log(`  User: ${imapConfig.user}`);
    console.log(`  Password: ${'*'.repeat(imapConfig.password.length)}`);
    console.log(`  TLS: ${imapConfig.tls}\n`);

    const imapService = new ImapService(imapConfig);

    try {
        console.log('Fetching first email from INBOX...');
        
        const fetchOptions: FetchOptions = {
            folder: 'INBOX',
            limit: 1,
            downloadBody: true,
            downloadAttachments: false,
            searchCriteria: ['ALL'],
            markAsRead: false,
        };

        const emails = await imapService.fetchEmails(fetchOptions);
        
        console.log(`? Success! Fetched ${emails.length} email(s)\n`);

        if (emails.length === 0) {
            console.log('??  INBOX is empty');
        } else {
            const email = emails[0]!;
            console.log('Email details:');
            console.log(`  UID: ${email.uid}`);
            console.log(`  From: ${email.from}`);
            console.log(`  To: ${email.to}`);
            console.log(`  Subject: ${email.subject}`);
            console.log(`  Date: ${email.date}`);
            
            if (email.textBody) {
                const preview = email.textBody.substring(0, 100).replace(/\n/g, ' ');
                console.log(`  Preview: ${preview}...`);
            }
        }
        
        await imapService.disconnect();
        console.log('\n? Disconnected successfully');

    } catch (error) {
        console.error('? Error:', (error as Error).message);
        console.error('Stack:', (error as Error).stack);
    } finally {
        await imapService.disconnect();
        console.log('\n=== Test completed ===');
    }
}

testFetchOne().catch(console.error);
