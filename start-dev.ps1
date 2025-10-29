Write-Host "Starting Proxi Development Environment..." -ForegroundColor Green
Write-Host ""

Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Set-Location Server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm install; npm run dev"

Write-Host ""
Write-Host "Waiting for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Starting Mobile App..." -ForegroundColor Yellow
Set-Location ..\BotanIQ
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm install; npm start"

Write-Host ""
Write-Host "Both servers are starting up..." -ForegroundColor Green
Write-Host "Backend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Mobile App: Check the Expo CLI for the URL" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
