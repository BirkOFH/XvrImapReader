import { ImapService, ImapConfig, FetchOptions } from './ImapService';

async function testImapService() {
    console.log('=== IMAP Service Test Runner ===\n');

    // Configuration from environment variables or defaults
    const config: ImapConfig = {
        host: process.env.IMAP_HOST || 'imap.example.com',
        port: parseInt(process.env.IMAP_PORT || '993'),
        user: process.env.IMAP_USER || 'your-email@example.com',
        password: process.env.IMAP_PASSWORD || 'your-password',
        tls: process.env.IMAP_TLS !== 'false',
        tlsOptions: {
            rejectUnauthorized: process.env.IMAP_REJECT_UNAUTHORIZED === 'true',
        },
    };

    // Display configuration (without password)
    console.log('Configuration:');
    console.log(`  Host: ${config.host}`);
    console.log(`  Port: ${config.port}`);
    console.log(`  User: ${config.user}`);
    console.log(`  Password: ${'*'.repeat(config.password.length)}`);
    console.log(`  TLS: ${config.tls}`);
    console.log('');

    const imapService = new ImapService(config);

    try {
        console.log('1. Testing connection...');
        const isConnected = await imapService.testConnection();
        console.log(`   Connection: ${isConnected ? '? SUCCESS' : '? FAILED'}\n`);

        if (!isConnected) {
            console.error('Cannot connect to IMAP server. Check your credentials.');
            return;
        }

        console.log('2. Getting folder list...');
        const folders = await imapService.getFolderList();
        console.log(`   Found ${folders.length} folders:`);
        folders.forEach((folder, index) => {
            console.log(`   ${index + 1}. ${folder}`);
        });
        console.log('');

        console.log('3. Fetching emails from INBOX...');
        const fetchOptions: FetchOptions = {
            folder: 'INBOX',
            limit: 5,
            downloadBody: true,
            downloadAttachments: false,
            searchCriteria: ['UNSEEN'],
            markAsRead: false,
        };

        const emails = await imapService.fetchEmails(fetchOptions);
        console.log(`   Found ${emails.length} unread emails:\n`);

        emails.forEach((email, index) => {
            console.log(`   Email #${index + 1}:`);
            console.log(`   UID: ${email.uid}`);
            console.log(`   From: ${email.from}`);
            console.log(`   Subject: ${email.subject}`);
            console.log(`   Date: ${email.date}`);
            
            if (email.textBody) {
                const preview = email.textBody.substring(0, 100).replace(/\n/g, ' ');
                console.log(`   Preview: ${preview}...`);
            }
            
            if (email.attachments && email.attachments.length > 0) {
                console.log(`   Attachments: ${email.attachments.length}`);
                email.attachments.forEach((att) => {
                    console.log(`     - ${att.filename} (${att.size} bytes)`);
                });
            }
            
            console.log('');
        });

        console.log('4. Testing with attachments...');
        const fetchWithAttachments: FetchOptions = {
            folder: 'INBOX',
            limit: 2,
            downloadBody: true,
            downloadAttachments: true,
            searchCriteria: ['ALL'],
            markAsRead: false,
        };

        const emailsWithAttachments = await imapService.fetchEmails(fetchWithAttachments);
        console.log(`   Fetched ${emailsWithAttachments.length} emails with attachments enabled\n`);

        emailsWithAttachments.forEach((email, index) => {
            console.log(`   Email #${index + 1}: ${email.subject}`);
            if (email.attachments && email.attachments.length > 0) {
                console.log(`   ?? Has ${email.attachments.length} attachment(s)`);
            } else {
                console.log(`   No attachments`);
            }
        });

    } catch (error) {
        console.error('? Error:', (error as Error).message);
        console.error('Stack:', (error as Error).stack);
    } finally {
        await imapService.disconnect();
        console.log('\n=== Test completed ===');
    }
}

testImapService().catch(console.error);
