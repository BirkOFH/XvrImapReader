@echo off
echo === Building project ===
call npm run build

if %errorlevel% equ 0 (
    echo.
    echo === Running IMAP Test ===
    node dist/app.js
) else (
    echo.
    echo Build failed!
    exit /b 1
)
