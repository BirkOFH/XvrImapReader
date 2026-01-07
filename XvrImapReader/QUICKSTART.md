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

### Способ 1: Улучшенный тест-раннер (РЕКОМЕНДУЕТСЯ) ??

**PowerShell:**
```powershell
.\run-test-advanced.ps1
```

Этот тест создает свежее подключение для каждой фазы - надежнее!

**Или через npm:**
```bash
npm run test:advanced
```

### Способ 2: Базовый тест-раннер

**PowerShell:**
```powershell
.\run-test.ps1
```

**CMD:**
```cmd
run-test.bat
```

**npm:**
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

4. Testing with attachments...
   Fetched 2 emails
   Email #1: Test Email
   ?? Has 1 attachment(s):
     - document.pdf (12345 bytes, application/pdf)

? All tests passed successfully!

=== Test completed ===
```

## ? Если ошибка:

### "Cannot connect to IMAP server"
- Проверьте правильность email и пароля
- Для Gmail используйте **App Password**, не обычный пароль
- Убедитесь, что IMAP включен в настройках Gmail

### "This socket has been ended by the other party"
- Это известная проблема при длительных тестах
- **Решение:** Используйте `.\run-test-advanced.ps1`
- Подробнее: см. `TROUBLESHOOTING.md`

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

### Запуск базового теста:
```bash
npm run dev
```

### Запуск улучшенного теста:
```bash
npm run test:advanced
```

---

## ?? Примечания

- ? Файл `.env` в `.gitignore` - пароли в безопасности
- ? Используйте `.env.example` как шаблон
- ? **Рекомендуется:** `.\run-test-advanced.ps1` для надежного тестирования
- ?? Проблемы? Смотрите `TROUBLESHOOTING.md`

**?? Готово! Теперь можете тестировать.**

**?? Важно:** Файл `.env` уже в `.gitignore` - ваши пароли НЕ попадут в Git!
