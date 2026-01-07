# ?? Инструкция по интеграции с n8n

## Шаг 1: Подготовка файлов

После успешной компиляции (`npm run build`) в папке `dist/` появятся скомпилированные файлы:

```
dist/
  ??? MyImap.node.js
  ??? MyImap.credentials.js
  ??? ImapService.js
  ??? (сопутствующие .d.ts и .map файлы)
```

## Шаг 2: Установка в n8n

### Вариант A: Custom Nodes (Простой способ)

1. Найдите папку с custom nodes n8n:
   ```bash
   # Linux/Mac
   ~/.n8n/custom/
   
   # Windows
   %USERPROFILE%\.n8n\custom\
   ```

2. Создайте папку, если её нет:
   ```bash
   mkdir ~/.n8n/custom
   ```

3. Скопируйте необходимые файлы:
   ```bash
   cp dist/MyImap.node.js ~/.n8n/custom/
   cp dist/MyImap.credentials.js ~/.n8n/custom/
   cp dist/ImapService.js ~/.n8n/custom/
   cp node_modules/imap-simple -r ~/.n8n/custom/
   cp node_modules/mailparser -r ~/.n8n/custom/
   ```

4. Перезапустите n8n:
   ```bash
   n8n start
   ```

### Вариант B: Community Node (Профессиональный способ)

1. Создайте npm пакет:

```json
// package.json
{
  "name": "n8n-nodes-advanced-imap",
  "version": "0.1.0",
  "description": "Advanced IMAP node for n8n",
  "license": "MIT",
  "homepage": "https://github.com/yourusername/n8n-nodes-advanced-imap",
  "author": {
    "name": "Your Name",
    "email": "your@email.com"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/n8n-nodes-advanced-imap.git"
  },
  "main": "index.js",
  "keywords": [
    "n8n-community-node-package",
    "n8n",
    "imap",
    "email"
  ],
  "n8n": {
    "n8nNodesApiVersion": 1,
    "credentials": [
      "dist/MyImap.credentials.js"
    ],
    "nodes": [
      "dist/MyImap.node.js"
    ]
  },
  "files": [
    "dist"
  ],
  "dependencies": {
    "imap-simple": "^5.1.0",
    "mailparser": "^3.9.1"
  },
  "devDependencies": {
    "@types/mailparser": "^3.4.4",
    "@types/node": "^25.0.3",
    "n8n-workflow": "latest",
    "typescript": "^5.9.3"
  }
}
```

2. Опубликуйте в npm:
   ```bash
   npm login
   npm publish --access public
   ```

3. Установите в n8n через Settings > Community Nodes:
   ```
   n8n-nodes-advanced-imap
   ```

## Шаг 3: Проверка установки

1. Откройте n8n в браузере
2. Создайте новый Workflow
3. Нажмите "+" для добавления узла
4. Найдите "My IMAP" в списке узлов
5. Если узел появился - установка успешна! ?

## Шаг 4: Настройка Credentials

1. В узле "My IMAP" нажмите на поле Credentials
2. Создайте новые credentials:
   - **Host**: imap.gmail.com (или ваш IMAP сервер)
   - **Port**: 993
   - **User**: ваш email
   - **Password**: пароль приложения (для Gmail)
   - **Use TLS**: ? Включено
   - **Allow Unauthorized Certificates**: (опционально)

### Настройка Gmail:

1. Включите 2FA в Google Account
2. Создайте App Password:
   - Google Account ? Security ? 2-Step Verification ? App passwords
   - Создайте пароль для "Mail"
   - Используйте этот пароль вместо обычного

## Шаг 5: Первый Workflow

Пример простого workflow для чтения непрочитанных писем:

```
1. Schedule Trigger (каждые 5 минут)
   ?
2. My IMAP (Fetch Emails)
   - Mailbox: INBOX
   - Read Status: Unread Only
   - Limit: 10
   - Data to Fetch: Metadata + Body
   - Mark as Read: ?
   ?
3. Set (обработка данных)
   ?
4. HTTP Request / Webhook / и т.д.
```

## Troubleshooting

### Узел не появляется в списке

1. Проверьте, что файлы скопированы в правильную папку
2. Перезапустите n8n командой:
   ```bash
   n8n stop
   n8n start
   ```
3. Проверьте логи n8n на ошибки

### Ошибка "Cannot find module"

Убедитесь, что все зависимости скопированы:
```bash
cd ~/.n8n/custom
npm install imap-simple mailparser
```

### Ошибка подключения к IMAP

1. Проверьте правильность host/port
2. Для Gmail используйте App Password
3. Проверьте, что IMAP включен в настройках почты
4. Попробуйте включить "Allow Unauthorized Certificates"

### Не скачиваются вложения

1. Убедитесь, что выбрано "Full (with Attachments)" в Data to Fetch
2. Проверьте размер писем - большие вложения могут вызывать таймауты

## Дополнительные примеры

### Скачать счета от определенного отправителя:
```
Operation: Fetch Emails
Mailbox: INBOX
Read Status: Unread Only
Data to Fetch: Full (with Attachments)
Additional Options:
  From Filter: invoices@company.com
  Subject Filter: Invoice
Mark as Read: ?
```

### Архивировать старые письма:
```
1. My IMAP (Fetch Emails) - получить письма
2. Set - обработать данные
3. My IMAP (Mark as Read) - если нужно пометить
```

## Поддержка

Если возникли проблемы:
1. Проверьте логи n8n
2. Запустите TestRunner.ts локально для проверки подключения
3. Создайте Issue в репозитории проекта

---

**Готово!** Теперь у вас есть полнофункциональный IMAP узел для n8n! ????
