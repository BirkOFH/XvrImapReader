import { config as loadEnv } from 'dotenv';

// Load environment variables from .env file
loadEnv();

import { ImapService, ImapConfig } from './ImapService';

async function testBasicConnection() {
    console.log('=== Basic Connection & Folders Test ===\n');

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
        console.log('Connecting and getting folders...');
        
        const folders = await imapService.getFolderList();
        
        console.log(`? Success! Found ${folders.length} folders:\n`);
        
        folders.forEach((folder, index) => {
            console.log(`  ${index + 1}. ${folder}`);
        });
        
        await imapService.disconnect();
        console.log('\n? Disconnected successfully');

    } catch (error) {
        console.error('? Error:', (error as Error).message);
    } finally {
        await imapService.disconnect();
        console.log('\n=== Test completed ===');
    }
}

testBasicConnection().catch(console.error);
