# PowerShell script to run advanced IMAP tests
# Usage: .\run-test-advanced.ps1

Write-Host "=== Building project ===" -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n=== Running Advanced IMAP Test ===" -ForegroundColor Cyan
    Write-Host "(Uses fresh connection for each test phase)" -ForegroundColor Gray
    node dist/TestRunnerAdvanced.js
} else {
    Write-Host "`n? Build failed!" -ForegroundColor Red
    exit 1
}
