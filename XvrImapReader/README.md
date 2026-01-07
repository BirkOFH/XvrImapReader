# Xvr Advanced IMAP Node для n8n

**?? Migrated to ImapFlow - Modern, Stable, Fast!**

[![npm version](https://img.shields.io/npm/v/n8n-nodes-xvr-advanced-imap.svg)](https://www.npmjs.com/package/n8n-nodes-xvr-advanced-imap)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## ?? Описание
Продвинутый узел для работы с IMAP протоколом в n8n. Поддерживает:
- ?? Получение списка папок
- ?? Фильтрацию по статусу прочтения
- ?? Скачивание тела письма (text/html)
- ?? Скачивание вложений
- ?? Дополнительные фильтры для отправителя
- ? Пометка по прочтению и флаги

## ?? **Recent Update (2025-01-07)**

? **Migrated from `imap-simple` to `imapflow`**
- Modern, actively maintained library
- Better compatibility with all IMAP servers (Yandex, Gmail, Outlook)
- No more EPIPE errors!
- Full TypeScript support

See `MIGRATION.md` for details.

---

## ?? Installation

### In n8n (Community Node)

1. Go to **Settings ? Community Nodes**
2. Click **Install**
3. Enter package name: `n8n-nodes-xvr-advanced-imap`
4. Click **Install**

### Manual Installation

```bash
npm install n8n-nodes-xvr-advanced-imap
```

---

## ?? Quick Start

### 1. Add Credentials

1. Go to **Credentials** in n8n
2. Click **+ Add Credential**
3. Search for **Xvr IMAP Credentials**
4. Fill in your IMAP server details:
   - Host: `imap.yandex.ru` (or your IMAP server)
   - Port: `993`
   - User: `your-email@example.com`
   - Password: your password (or App Password for Gmail)
   - Secure Connection: `true`

### 2. Use in Workflow

1. Add **Xvr Advanced IMAP** node to your workflow
2. Select your credentials
3. Choose operation:
   - **Fetch Emails** - retrieve emails
   - **Get Folders** - get mailbox folders

---

## ?? Features

### Fetch Emails

- **Mailbox Selection**: INBOX, Sent, Drafts, or any folder
- **Read Status Filter**: All, Unread Only, Read Only
- **Flexible Data Fetching**:
  - Metadata Only (subject, from, to, date)
  - Metadata + Body (includes text and HTML)
  - Full (with Attachments as binary data)
- **Search Filters**: By sender, by subject
- **Mark as Read**: Optionally mark emails as read
- **Limit**: Control how many emails to fetch (1-1000)

### Get Folders

- Retrieve all available mailbox folders
- Supports nested folders
- Works with any IMAP server

---

## ?? Output Structure

### Email Data (JSON)

```json
{
  "uid": 12345,
  "subject": "Test Email",
  "from": "sender@example.com",
  "to": "recipient@example.com",
  "date": "2024-01-15T10:30:00.000Z",
  "textBody": "Email text...",
  "htmlBody": "<html>...</html>",
  "attachmentCount": 2
}
```

### Attachments (Binary Data)

```
binary: {
  attachment_0: {
    data: "base64...",
    mimeType: "application/pdf",
    fileName: "document.pdf"
  },
  attachment_1: {
    data: "base64...",
    mimeType: "image/jpeg",
    fileName: "photo.jpg"
  }
}
```

---

## ?? Examples

### Example 1: Fetch Unread Emails

```yaml
Operation: Fetch Emails
Mailbox: INBOX
Read Status: Unread Only
Limit: 10
Data to Fetch: Metadata + Body
Mark as Read: true
```

### Example 2: Download Attachments

```yaml
Operation: Fetch Emails
Mailbox: INBOX
Read Status: All
Data to Fetch: Full (with Attachments)
Limit: 50
```

### Example 3: Filter by Sender

```yaml
Operation: Fetch Emails
Mailbox: INBOX
Additional Options:
  From Filter: noreply@company.com
Data to Fetch: Metadata + Body
```

---

## ?? Supported IMAP Servers

| Provider | Tested | IMAP Host | Port |
|----------|--------|-----------|------|
| **Yandex** | ? Yes | imap.yandex.ru | 993 |
| **Gmail** | ?? Compatible | imap.gmail.com | 993 |
| **Outlook** | ?? Compatible | outlook.office365.com | 993 |
| **Yahoo** | ?? Compatible | imap.mail.yahoo.com | 993 |
| **Others** | ?? Should work | - | 993 |

**Note for Gmail:** Use [App Password](https://support.google.com/accounts/answer/185833) instead of your regular password.

---

## ?? Documentation

- **README.md** (this file) - Overview and quick start
- **QUICKSTART.md** - Detailed testing guide
- **INSTALLATION.md** - Installation instructions
- **TESTING.md** - Local testing guide
- **MIGRATION.md** - ImapFlow migration history
- **STATUS.md** - Project status (100% ready)
- **TEST_RESULTS.md** - Test results

---

## ?? Troubleshooting

### Connection Error
- Verify host, port, user, and password
- Ensure port 993 is correct (SSL/TLS)
- Enable "Allow Unauthorized Certificates" for self-signed certificates

### Can't Find Folders
- Use "Get Folders" operation to see available folders
- Note: folder separators may vary (/, ., |)

### Attachments Not Downloading
- Select "Full (with Attachments)" in Data to Fetch
- Check email size and timeout settings

### Gmail "Invalid Credentials"
- Use App Password, not regular password
- Enable IMAP in Gmail settings

---

## ??? Development

### Local Testing

1. Clone repository:
```bash
git clone https://github.com/BirkOFH/XvrImapReader.git
cd XvrImapReader
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env`:
```bash
cp .env.example .env
# Edit .env with your IMAP credentials
```

4. Run tests:
```bash
npm run test:advanced
```

See `TESTING.md` for detailed instructions.

---

## ?? License

ISC License - see LICENSE file for details.

---

## ?? Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## ?? Support

- **GitHub Issues**: https://github.com/BirkOFH/XvrImapReader/issues
- **Documentation**: See docs in repository
- **n8n Community**: https://community.n8n.io/

---

## ? Credits

Built with:
- [ImapFlow](https://github.com/postalsys/imapflow) - Modern IMAP client
- [mailparser](https://github.com/nodemailer/mailparser) - Email parsing
- [n8n](https://n8n.io/) - Workflow automation platform

---

**?? Status:** Production Ready ?  
**?? Version:** 1.0.0  
**?? Last Updated:** 2025-01-07

**Made with ?? for the n8n community**
