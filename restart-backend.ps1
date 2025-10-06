# Backend Restart Script
Write-Host "🔄 Restarting Backend Server..." -ForegroundColor Yellow
Write-Host ""

# Step 1: Stop existing server on port 5000
Write-Host "Step 1: Stopping old backend server..." -ForegroundColor Cyan
try {
    $connection = Get-NetTCPConnection -LocalPort 5000 -ErrorAction Stop
    $processId = $connection.OwningProcess
    Write-Host "  Found backend running on PID: $processId" -ForegroundColor Gray
    Stop-Process -Id $processId -Force
    Write-Host "  ✅ Old backend stopped" -ForegroundColor Green
    Start-Sleep -Seconds 1
} catch {
    Write-Host "  ℹ️ No backend running on port 5000" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Step 2: Starting new backend server..." -ForegroundColor Cyan
Write-Host "  📁 Directory: $PSScriptRoot" -ForegroundColor Gray
Write-Host "  🚀 Starting: node server.js" -ForegroundColor Gray
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host ""

# Change to backend directory and start server
Set-Location $PSScriptRoot
node server.js

