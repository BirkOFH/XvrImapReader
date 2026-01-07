# ?? Руководство по локальному тестированию

## ?? **Быстрый старт:**

### Шаг 1: Установите зависимости
```bash
npm install
```

### Шаг 2: Настройте .env

Создайте файл `.env` из примера:
```bash
cp .env.example .env
```

Отредактируйте `.env` с вашими credentials:
```env
IMAP_HOST=imap.yandex.ru
IMAP_PORT=993
IMAP_USER=your-email@yandex.ru
IMAP_PASSWORD=your-password
IMAP_TLS=true
IMAP_REJECT_UNAUTHORIZED=false
```

### Шаг 3: Соберите проект
```bash
npm run build
```

---

## ?? **Доступные тесты:**

### 1. Полный тест (рекомендуется) ?
```bash
.\run-test-advanced.ps1
```
Или:
```bash
npm run test:advanced
```

**Что тестирует:**
- ? Подключение к IMAP
- ? Получение списка папок
- ? Поиск непрочитанных писем
- ? Скачивание с вложениями

---

### 2. Базовый тест (подключение + папки)
```bash
.\test-basic.ps1
```

**Что тестирует:**
- ? Подключение
- ? Список папок

---

### 3. Тест получения писем
```bash
.\test-fetch-one.ps1
```

**Что тестирует:**
- ? Получение первого письма из INBOX

---

### 4. Тест вложений
```bash
.\test-attachments.ps1
```

**Что тестирует:**
- ? Скачивание вложений из писем

---

### 5. Через npm (все тесты)
```bash
npm run test              # Основной тест
npm run test:advanced     # Расширенный тест
npm run test:attachments  # Только вложения
```

---

## ?? **Ожидаемый результат:**

```
=== IMAP Service Test Runner (Advanced) ===

Configuration:
  Host: imap.yandex.ru
  Port: 993
  User: user@yandex.ru
  TLS: true

1. Testing connection...
   Connection: ? SUCCESS

2. Getting folder list...
   Found 7 folders:
   1. INBOX
   2. Sent
   3. Drafts
   ...

3. Fetching unread emails from INBOX...
   Found 0 unread emails

4. Testing attachment support...
   Fetched 2 emails from INBOX
   ? Attachment download works!

? All critical tests passed!
   Your IMAP node is ready for use in n8n! ??
```

---

## ?? **Troubleshooting**

### Ошибка: "Cannot connect to IMAP server"
**Решение:**
- Проверьте правильность host, port, user, password
- Для Gmail используйте App Password (не обычный пароль)
- Убедитесь, что IMAP включен в настройках почты

### Ошибка: "Cannot find module"
**Решение:**
```bash
npm install
npm run build
```

### Ошибка: "Connection timeout"
**Решение:**
- Проверьте интернет-соединение
- Убедитесь, что firewall не блокирует порт 993
- Попробуйте отключить VPN

---

## ?? **Настройка для разных провайдеров:**

### Yandex:
```env
IMAP_HOST=imap.yandex.ru
IMAP_PORT=993
IMAP_USER=user@yandex.ru
IMAP_PASSWORD=your-password
```

### Gmail:
```env
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_USER=user@gmail.com
IMAP_PASSWORD=your-app-password  # Используйте App Password!
```

**Как получить Gmail App Password:**
1. Включите 2FA: https://myaccount.google.com/security
2. Создайте App Password: https://myaccount.google.com/apppasswords
3. Выберите "Mail" ? скопируйте 16-значный пароль

### Outlook/Office365:
```env
IMAP_HOST=outlook.office365.com
IMAP_PORT=993
IMAP_USER=user@outlook.com
IMAP_PASSWORD=your-password
```

---

## ?? **Что тестируется:**

| Тест | Файл | Что проверяет |
|------|------|---------------|
| **Полный** | `TestRunnerAdvanced.ts` | Все функции |
| **Базовый** | `TestBasic.ts` | Подключение + папки |
| **Одно письмо** | `TestFetchOne.ts` | Получение писем |
| **Вложения** | `TestAttachments.ts` | Скачивание файлов |

---

## ?? **Visual Studio (F5)**

Если используете Visual Studio:
1. Откройте `XvrImapReader.sln`
2. Убедитесь, что `.env` настроен
3. Нажмите **F5** или выберите Debug ? Start Debugging

---

## ?? **Безопасность:**

- ? Файл `.env` в `.gitignore`
- ? Пароли не попадают в Git
- ? Используйте `.env.example` как шаблон
- ?? Никогда не коммитьте `.env` в репозиторий!

---

## ?? **Примечания:**

- Все тесты используют ImapFlow (современная библиотека)
- Тесты безопасны - не изменяют письма (если не указано `markAsRead: true`)
- После миграции на ImapFlow все проблемы с EPIPE решены
- Тесты работают стабильно с Yandex IMAP

**?? Готово! Можете тестировать.**

См. также:
- `QUICKSTART.md` - быстрый старт
- `TEST_RESULTS.md` - результаты тестирования
- `MIGRATION.md` - история миграции на ImapFlow
