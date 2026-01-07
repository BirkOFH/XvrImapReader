# Advanced IMAP Node для n8n

**?? Migrated to ImapFlow - Modern, Stable, Fast!**

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

## ?? Структура

```
ImapService.ts          - Бизнес-логика работы с IMAP (ImapFlow)
TestRunner.ts           - Локальный тест и отладка
TestRunnerAdvanced.ts   - Улучшенный тест с управлением соединениями
MyImap.node.ts          - n8n интерфейс узла
MyImap.credentials.ts   - n8n credentials
```

## ?? Быстрый старт

### 1. Установка зависимостей
```bash
npm install
```

### 2. Локальное тестирование

#### Создайте `.env`:
```bash
cp .env.example .env
# Отредактируйте .env с вашими credentials
```

#### Запустите тест:
```powershell
# Рекомендуется (надежный тест с управлением соединениями)
.\run-test-advanced.ps1

# Или базовый тест
.\run-test.ps1
```

**?? Подробная инструкция:** см. `QUICKSTART.md`

### 3. Интеграция с n8n

#### Вариант A: Community Node (рекомендуется)

1. Скомпилируйте:
```bash
npm run build
```

2. Опубликуйте в npm или установите локально:
```bash
cd ~/.n8n/custom
npm install /path/to/your/package
```

**?? Подробная инструкция:** см. `INSTALLATION.md`

#### Вариант B: Прямое копирование (для разработки)

```bash
npm run build
cp dist/MyImap.node.js ~/.n8n/custom/
cp dist/MyImap.credentials.js ~/.n8n/custom/
cp dist/ImapService.js ~/.n8n/custom/
```

Перезапустите n8n:
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

## ?? Структура вывода

### Основные поля:

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

### Бинарные данные (вложения):

```
binary: {
  attachment_0: {
    data: "base64...",
    mimeType: "application/pdf",
    fileName: "document.pdf"
  }
}
```

## ?? Разработка

### Локальный запуск:
```bash
npm run dev                  # Базовый тест
npm run test:advanced        # Улучшенный тест (рекомендуется)
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
- Обратите внимание разделители могут различаться (/, ., |)

### Не скачиваются вложения
- Убедитесь, что выбрано "Full (with Attachments)" в Data to Fetch
- Проверьте размер писем при больших объемах

### "INBOX is empty" в тестах
- Это не ошибка! Просто нет непрочитанных писем
- Отправьте себе тестовое письмо для проверки
- Функциональность полностью работоспособна

### Таймауты при больших вложениях
- Увеличьте timeout в настройках n8n workflow
- Рассмотрите обработку больших файлов отдельно

---

## ?? Документация

- **README.md** (этот файл) - Обзор проекта и quick start
- **QUICKSTART.md** - Подробный быстрый старт для тестирования
- **INSTALLATION.md** - Детальная инструкция по установке в n8n
- **TESTING.md** - Руководство по локальному тестированию
- **MIGRATION.md** - История миграции на ImapFlow (2025-01-07)
- **STATUS.md** - Текущий статус проекта (100% готов)
- **TEST_RESULTS.md** - Результаты тестирования

## ?? Лицензия
ISC

## ?? Поддержка
При возникших проблемах:
1. Проверьте `TROUBLESHOOTING.md`
2. Запустите `TestRunnerAdvanced.ts` локально
3. Создайте Issue в репозитории

---

**? Статус проекта:** Полностью функционален и готов к использованию!
