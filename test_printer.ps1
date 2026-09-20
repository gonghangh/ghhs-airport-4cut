# EPSON L8180 프린터 상태 및 연결 테스트 스크립트
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  🛫 공항네컷 - EPSON L8180 프린터 상태 점검" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan

$epson = Get-Printer | Where-Object { $_.Name -like "*L8180*" }

if ($epson) {
    Write-Host "[✓] 프린터 감지됨: $($epson.Name)" -ForegroundColor Green
    Write-Host "    - 드라이버: $($epson.DriverName)" -ForegroundColor Gray
    Write-Host "    - 포트: $($epson.PortName)" -ForegroundColor Gray
    Write-Host "    - 프린터 상태: $($epson.PrinterStatus)" -ForegroundColor Yellow

    Write-Host ""
    Write-Host "현재 프린터 큐 대기 작업 수: $($epson.JobCount)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "프린터가 정상적으로 연결되어 있습니다! 공항네컷에서 바로 출력하실 수 있습니다." -ForegroundColor Green
} else {
    Write-Host "[!] EPSON L8180 프린터를 찾을 수 없습니다." -ForegroundColor Red
    Write-Host "감지된 다른 프린터 목록:" -ForegroundColor Yellow
    Get-Printer | Format-Table Name, DriverName, PrinterStatus
}
