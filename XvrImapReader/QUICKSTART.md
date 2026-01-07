# ?? Быстрый старт для тестирования

## Шаг 1: Настройте credentials

Откройте файл `.env` и замените значения на свои:

```env
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_USER=ваш-email@gmail.com
IMAP_PASSWORD=ваш-пароль-приложения
IMAP_TLS=true
IMAP_REJECT_UNAUTHORIZED=false
```

## Шаг 2: Получите App Password для Gmail

1. Перейдите: https://myaccount.google.com/apppasswords
2. Создайте пароль для "Mail"
3. Скопируйте 16-значный пароль (без пробелов)
4. Вставьте в `.env` в поле `IMAP_PASSWORD`

## Шаг 3: Запустите тест

### Способ 1: Через скрипт (РЕКОМЕНДУЕТСЯ) ??

**Windows PowerShell:**
```powershell
.\run-test.ps1
```

**Windows CMD:**
```cmd
run-test.bat
```

### Способ 2: Через npm
```bash
npm run dev
```

### Способ 3: В Visual Studio (F5)

1. Откройте `TestRunner.ts` или любой файл проекта
2. В меню Debug выберите конфигурацию: **"Launch IMAP Test"**
3. Нажмите **F5**

**Примечание:** Перед запуском через F5 нужно один раз собрать проект:
```bash
npm run build
```

## ? Что должно произойти:

```
=== IMAP Service Test Runner ===

Configuration:
  Host: imap.gmail.com
  Port: 993
  User: your@gmail.com
  Password: ****************
  TLS: true

1. Testing connection...
   Connection: ? SUCCESS

2. Getting folder list...
   Found 8 folders:
   1. INBOX
   2. [Gmail]/Sent Mail
   ...

3. Fetching emails from INBOX...
   Found 3 unread emails:
   ...

=== Test completed ===
```

## ? Если ошибка:

### "Cannot connect to IMAP server"
- Проверьте правильность email и пароля
- Для Gmail используйте **App Password**, не обычный пароль
- Убедитесь, что IMAP включен в настройках Gmail

### "Cannot find module"
```bash
npm install
npm run build
```

### "Invalid credentials"
- Для Gmail: используйте App Password (https://myaccount.google.com/apppasswords)
- Для других сервисов: проверьте, что IMAP включен

### "Connection timeout"
- Проверьте правильность host и port
- Убедитесь, что есть интернет-соединение
- Попробуйте отключить VPN/Firewall

---

## ?? Дополнительные команды

### Сборка проекта:
```bash
npm run build
```

### Очистка:
```bash
npm run clean
```

### Запуск тестов:
```bash
npm run dev
```

---

## ?? Примечания

- ? Файл `.env` в `.gitignore` - пароли в безопасности
- ? Используйте `.env.example` как шаблон
- ? Самый простой способ запуска: `.\run-test.ps1` или `run-test.bat`

**?? Готово! Теперь можете тестировать.**

**?? Важно:** Файл `.env` уже в `.gitignore` - ваши пароли НЕ попадут в Git!
