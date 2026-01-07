import { config as loadEnv } from 'dotenv';

// Load environment variables from .env file
loadEnv();

import { ImapService, ImapConfig, FetchOptions } from './ImapService';

async function testAttachments() {
    console.log('=== Test 4: Attachment Support (Standalone) ===\n');

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
    console.log(`  TLS: ${imapConfig.tls}`);
    console.log('');

    const imapService = new ImapService(imapConfig);

    try {
        console.log('Testing attachment download from INBOX...');
        console.log('(This test fetches ALL emails, including read ones)\n');
        
        const fetchOptions: FetchOptions = {
            folder: 'INBOX',
            limit: 5,  // Увеличим до 5 писем для большей вероятности найти вложения
            downloadBody: true,
            downloadAttachments: true,
            searchCriteria: ['ALL'],  // Все письма
            markAsRead: false,
        };

        console.log('Connecting to server...');
        const emails = await imapService.fetchEmails(fetchOptions);
        console.log(`? Successfully fetched ${emails.length} emails from INBOX\n`);

        if (emails.length === 0) {
            console.log('??  INBOX appears to be empty or inaccessible');
            console.log('   Try sending yourself a test email first');
        } else {
            let totalAttachments = 0;
            
            emails.forEach((email, index) => {
                console.log(`Email #${index + 1}:`);
                console.log(`  UID: ${email.uid}`);
                console.log(`  From: ${email.from}`);
                console.log(`  Subject: ${email.subject}`);
                console.log(`  Date: ${email.date}`);
                
                if (email.attachments && email.attachments.length > 0) {
                    console.log(`  ? Has ${email.attachments.length} attachment(s):`);
                    email.attachments.forEach((att) => {
                        console.log(`     ?? ${att.filename} (${att.size} bytes, ${att.mimeType})`);
                        totalAttachments++;
                    });
                } else {
                    console.log(`  No attachments`);
                }
                
                if (email.textBody) {
                    const preview = email.textBody.substring(0, 80).replace(/\n/g, ' ');
                    console.log(`  Preview: ${preview}...`);
                }
                console.log('');
            });

            console.log(`?? Summary:`);
            console.log(`   Total emails checked: ${emails.length}`);
            console.log(`   Total attachments found: ${totalAttachments}`);
            
            if (totalAttachments === 0) {
                console.log('\n?? Tip: None of these emails have attachments.');
                console.log('   Send yourself an email with a PDF/image to test attachment download.');
            } else {
                console.log('\n? Attachment download functionality works perfectly!');
            }
        }

    } catch (error) {
        console.error('? Error occurred during test:');
        console.error(`   Message: ${(error as Error).message}`);
        
        if ((error as any).code === 'EPIPE') {
            console.error('\n?? Analysis:');
            console.error('   This is an EPIPE error - server closed connection');
            console.error('   Possible reasons:');
            console.error('   1. Server detected suspicious activity (too many recent connections)');
            console.error('   2. Mailbox is locked or being accessed from another location');
            console.error('   3. Server timeout or rate limiting');
            console.error('\n?? Suggestions:');
            console.error('   - Wait 1-2 minutes before trying again');
            console.error('   - Check if email client is open (Outlook, Thunderbird, etc.)');
            console.error('   - Try with Gmail instead (less strict)');
        } else {
            console.error('Stack:', (error as Error).stack);
        }
    } finally {
        await imapService.disconnect();
        console.log('\n=== Test completed ===');
    }
}

testAttachments().catch(console.error);
