@echo off
chcp 65001 > nul
title 공항네컷 (Airport 4-Cuts) 무인 키오스크 자동출력 모드

echo ========================================================
echo    🛫 공항네컷 (Airport 4-Cuts) 무인 자동인쇄 키오스크
echo ========================================================
echo   * 이 모드는 인쇄 버튼 클릭 시 다이얼로그 창 없이
echo     기본 프린터(EPSON L8180)로 즉시 자동 인쇄됩니다!
echo ========================================================
echo.

cd /d "%~dp0"

:: 1. Start background local server
netstat -ano | findstr :8899 > nul
if %ERRORLEVEL% neq 0 (
    echo [1/2] 로컬 서버를 백그라운드에서 시작하는 중...
    start "" powershell -WindowStyle Hidden -ExecutionPolicy Bypass -File "server.ps1"
    timeout /t 2 /nobreak > nul
)

:: 2. Find Chrome or Edge for Kiosk Printing
set BROWSER_EXE=
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    set "BROWSER_EXE=C:\Program Files\Google\Chrome\Application\chrome.exe"
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    set "BROWSER_EXE=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
) else if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    set "BROWSER_EXE=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
)

if "%BROWSER_EXE%"=="" (
    start http://localhost:8899/
) else (
    echo [2/2] 9:16 무인 터치 자동인쇄 키오스크 모드로 실행합니다...
    start "" "%BROWSER_EXE%" --kiosk --kiosk-printing --touch-events=enabled --disable-pinch --overscroll-history-navigation=0 --hide-scrollbars http://localhost:8899/
)
