# PowerShell script to run IMAP tests
# Usage: .\run-test.ps1

Write-Host "=== Building project ===" -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n=== Running IMAP Test ===" -ForegroundColor Cyan
    node dist/app.js
} else {
    Write-Host "`n? Build failed!" -ForegroundColor Red
    exit 1
}
