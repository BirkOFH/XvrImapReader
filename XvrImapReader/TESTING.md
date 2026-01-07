# ?? Инструкция по локальному тестированию

## Метод 1: Через переменные окружения (РЕКОМЕНДУЕТСЯ) ??

**Безопасно - пароли не попадут в Git!**

### Шаг 1: Создайте файл .env

```bash
cp .env.example .env
```

### Шаг 2: Заполните .env своими данными

Откройте `.env` и замените значения:

```env
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_USER=your-email@gmail.com
IMAP_PASSWORD=your-app-password-here
IMAP_TLS=true
IMAP_REJECT_UNAUTHORIZED=false
```

### Шаг 3: Запустите тест

**Через Visual Studio:**
- Нажмите F5 (или Ctrl+F5)

**Через терминал:**
```bash
npm run dev
```

---

## Метод 2: Прямое редактирование TestRunner.ts (НЕ РЕКОМЕНДУЕТСЯ)

?? **Внимание:** Не коммитьте файл с реальными паролями!

Откройте `TestRunner.ts` и измените конфигурацию напрямую:

```typescript
const config: ImapConfig = {
    host: 'imap.gmail.com',
    port: 993,
    user: 'your-email@gmail.com',
    password: 'your-app-password',
    tls: true,
    tlsOptions: {
        rejectUnauthorized: false,
    },
};
```

---

## ?? Настройка Gmail App Password

Если используете Gmail, обычный пароль не подойдет. Нужен **App Password**:

### 1. Включите 2FA
- Перейдите: https://myaccount.google.com/security
- Найдите "2-Step Verification"
- Включите двухфакторную аутентификацию

### 2. Создайте App Password
- Перейдите: https://myaccount.google.com/apppasswords
- Выберите "Mail" и устройство
- Скопируйте сгенерированный пароль (16 символов без пробелов)
- Используйте этот пароль в `.env` или `TestRunner.ts`

---

## ? Что тестирует TestRunner?

1. ? **Подключение к IMAP серверу**
2. ? **Получение списка папок**
3. ? **Получение непрочитанных писем**
4. ? **Скачивание текста письма**
5. ? **Скачивание вложений**

---

## ?? Примеры вывода

### Успешный запуск:
```
=== IMAP Service Test Runner ===

Configuration:
  Host: imap.gmail.com
  Port: 993
  User: test@gmail.com
  Password: ****************
  TLS: true

1. Testing connection...
   Connection: ? SUCCESS

2. Getting folder list...
   Found 8 folders:
   1. INBOX
   2. [Gmail]/Sent Mail
   3. [Gmail]/Drafts
   ...

3. Fetching emails from INBOX...
   Found 3 unread emails:

   Email #1:
   UID: 12345
   From: sender@example.com
   Subject: Test Email
   Date: Mon Jan 15 2024 10:30:00
   Preview: Hello, this is a test email...

=== Test completed ===
```

### Ошибка подключения:
```
1. Testing connection...
   Connection: ? FAILED

Cannot connect to IMAP server. Check your credentials.
```

---

## ?? Troubleshooting

### Ошибка: "Cannot find module"
```bash
npm run build
npm run dev
```

### Ошибка: "Invalid credentials"
- Проверьте правильность email и пароля
- Для Gmail используйте App Password
- Убедитесь, что IMAP включен в настройках почты

### Ошибка: "Connection timeout"
- Проверьте правильность host и port
- Убедитесь, что есть интернет-соединение
- Попробуйте отключить VPN/Firewall

### Ошибка: "self signed certificate"
- Установите `IMAP_REJECT_UNAUTHORIZED=false` в `.env`

---

## ?? Быстрый старт (для нетерпеливых)

```bash
# 1. Установите зависимости
npm install

# 2. Создайте .env
cp .env.example .env

# 3. Отредактируйте .env (вставьте свои credentials)
# nano .env  # или откройте в редакторе

# 4. Запустите тест
npm run dev
```

---

## ?? Примечания

- ? Файл `.env` в `.gitignore` - пароли в безопасности
- ? Используйте `.env.example` как шаблон
- ? При работе с TestRunner.ts не забудьте откатить изменения перед коммитом:
  ```bash
  git checkout TestRunner.ts
  ```

**Готово! Теперь можете безопасно тестировать локально.** ??
