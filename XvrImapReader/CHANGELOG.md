В этом файле объясняется, как Visual Studio создала проект.

Для создания этого проекта использовались следующие средства:
- TypeScript Compiler (tsc)

Для создания этого проекта были использованы следующие шаги:
- Создание файла проекта (`XvrImapReader.esproj`).
- Создайте `launch.json`, чтобы включить отладку.
- Установите пакеты npm и создайте `tsconfig.json`: `npm init && npm i --save-dev eslint typescript @types/node && npx tsc --init --sourceMap true`.
- Создать `app.ts`.
- Обновление точки входа `package.json`.
- Обновите сценарии сборки TypeScript в `package.json`.
- Создайте `eslint.config.js`, чтобы включить анализ кода.
- Добавить проект в решение.
- Запишите этот файл.
