# Advanced IMAP Node для n8n

## ?? Описание
Продвинутый узел для работы с IMAP протоколом в n8n. Поддерживает:
- ?? Получение списка папок
- ?? Фильтрацию по статусу прочтения
- ?? Скачивание тела письма (text/html)
- ?? Скачивание вложений
- ?? Дополнительные фильтры для отправителя
- ? Пометка по прочтению и флаги

## ?? Структура

```
ImapService.ts          - Бизнес-логика работы с IMAP (независимая от n8n)
TestRunner.ts           - Локальный тест и отладка
MyImap.node.ts          - n8n интерфейс узла
MyImap.credentials.ts   - n8n credentials
```

## ?? Быстрый старт

### 1. Установка зависимостей
```bash
npm install
```

### 2. Локальное тестирование (Visual Studio)

Отредактируйте `TestRunner.ts` и укажите свои IMAP credentials:

```typescript
const config: ImapConfig = {
    host: 'imap.example.com',
    port: 993,
    user: 'your-email@example.com',
    password: 'your-password',
    tls: true,
};
```

Запустите:
```bash
npm run dev
```

### 3. Интеграция с n8n

#### Вариант A: Community Node (рекомендуется)

1. Создайте npm пакет:
```bash
npm init -scope=@yourusername
```

2. Добавьте в `package.json`:
```json
{
  "name": "@yourusername/n8n-nodes-imap",
  "version": "0.1.0",
  "description": "Advanced IMAP node for n8n",
  "main": "index.js",
  "n8n": {
    "nodes": ["dist/MyImap.node.js"],
    "credentials": ["dist/MyImap.credentials.js"]
  }
}
```

3. Скомпилируйте:
```bash
npm run build
```

4. Установите в n8n:
```bash
cd ~/.n8n/custom
npm install /path/to/your/package
```

#### Вариант B: Прямое копирование (для разработки)

1. Скопируйте файлы в `~/.n8n/custom/`:
```bash
npm run build
cp dist/MyImap.node.js ~/.n8n/custom/
cp dist/MyImap.credentials.js ~/.n8n/custom/
cp dist/ImapService.js ~/.n8n/custom/
```

2. Перезапустите n8n:
```bash
n8n start
```

## ?? Использование

### В n8n Workflow:

1. Добавьте узел "My IMAP"
2. Создайте credentials с данными IMAP сервера
3. Выберите операцию:
   - **Fetch Emails** - получить письма
   - **Get Folders** - получить список папок

### Настройки Fetch Emails:

- **Mailbox Name**: Папка (INBOX, Sent, Spam и т.д.)
- **Read Status**: All / Unread Only / Read Only
- **Limit**: Максимальное количество писем (1-1000)
- **Data to Fetch**:
  - Metadata Only - только метаданные
  - Metadata + Body - с текстом письма
  - Full (with Attachments) - все данные + вложения
- **Mark as Read**: Пометить письма как прочитанные

### Дополнительные опции:

- **From Filter**: Фильтр по отправителю
- **Subject Filter**: Фильтр по теме

## ?? Структура

### Выходные данные

#### Основные поля:

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

#### Бинарные данные (вложения):

```
binary: {
  attachment_0: {
    data: "base64...",
    mimeType: "application/pdf",
    fileName: "document.pdf"
  },
  attachment_1: {
    ...
  }
}
```

## ?? Разработка

### Локальный запуск:
```bash
npm run dev
```

### Сборка проекта:
```bash
npm run build
```

### Очистка:
```bash
npm run clean
```

## ?? Примеры использования

### Пример 1: Получить непрочитанные письма
```typescript
{
  mailbox: 'INBOX',
  readStatus: 'unread',
  limit: 10,
  dataToFetch: 'body',
  markAsRead: true
}
```

### Пример 2: Скачать все вложения из папки
```typescript
{
  mailbox: 'INBOX',
  readStatus: 'all',
  limit: 50,
  dataToFetch: 'full',
  markAsRead: false
}
```

### Пример 3: Фильтр по отправителю
```typescript
{
  mailbox: 'INBOX',
  additionalOptions: {
    fromFilter: 'noreply@company.com'
  },
  dataToFetch: 'body'
}
```

## ?? Troubleshooting

### Ошибка подключения
- Проверьте правильность host, port, user, password
- Убедитесь, что используется правильный порт (993 для SSL)
- Включите "Allow Unauthorized Certificates" для самоподписанных сертификатов

### Не находит папки
- Используйте операцию "Get Folders" для получения доступных папок
- Обратите внимание разделители могут различаться (/, .)

### Не скачиваются вложения
- Убедитесь, что выбрано "Full (with Attachments)" в Data to Fetch
- Проверьте размер писем при больших объемах

## ?? Лицензия
ISC

## ?? Поддержка
При возникших с вопросом проблемах создавайте Issue в репозитории.
