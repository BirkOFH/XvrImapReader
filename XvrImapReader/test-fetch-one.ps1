# PowerShell script to test fetching one email
# Usage: .\test-fetch-one.ps1

Write-Host "=== Building project ===" -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n=== Fetching One Email ===" -ForegroundColor Cyan
    node dist/TestFetchOne.js
} else {
    Write-Host "`n? Build failed!" -ForegroundColor Red
    exit 1
}
