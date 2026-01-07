# PowerShell script to test basic connection
# Usage: .\test-basic.ps1

Write-Host "=== Building project ===" -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n=== Running Basic Test ===" -ForegroundColor Cyan
    node dist/TestBasic.js
} else {
    Write-Host "`n? Build failed!" -ForegroundColor Red
    exit 1
}
