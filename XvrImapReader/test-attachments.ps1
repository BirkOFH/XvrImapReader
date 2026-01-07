# PowerShell script to test attachment functionality only
# Usage: .\test-attachments.ps1

Write-Host "=== Building project ===" -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n=== Testing Attachment Download ===" -ForegroundColor Cyan
    Write-Host "(Standalone test - no connection conflicts)" -ForegroundColor Gray
    node dist/TestAttachments.js
} else {
    Write-Host "`n? Build failed!" -ForegroundColor Red
    exit 1
}
