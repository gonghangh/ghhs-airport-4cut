@echo off
chcp 65001 > nul
title 공항네컷 (Airport 4-Cuts) Kiosk Launcher

echo ========================================================
echo    🛫 공항네컷 (Airport 4-Cuts) 키오스크를 시작합니다!
echo ========================================================
echo.

cd /d "%~dp0"

:: 1. Start background local server if not already running
netstat -ano | findstr :8899 > nul
if %ERRORLEVEL% neq 0 (
    echo [1/2] 로컬 서버를 백그라운드에서 시작하는 중...
    start "" powershell -WindowStyle Hidden -ExecutionPolicy Bypass -File "server.ps1"
    timeout /t 2 /nobreak > nul
) else (
    echo [1/2] 로컬 서버가 이미 실행 중입니다.
)

:: 2. Find Chrome or Edge
set BROWSER_EXE=
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    set "BROWSER_EXE=C:\Program Files\Google\Chrome\Application\chrome.exe"
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    set "BROWSER_EXE=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
) else if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    set "BROWSER_EXE=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
)

if "%BROWSER_EXE%"=="" (
    echo [2/2] 기본 브라우저로 엽니다...
    start http://localhost:8899/
) else (
    echo [2/2] 9:16 터치 키오스크 모드로 실행합니다: %BROWSER_EXE%
    start "" "%BROWSER_EXE%" --app=http://localhost:8899/ --start-maximized --touch-events=enabled --disable-pinch --overscroll-history-navigation=0 --hide-scrollbars
)

echo.
echo ========================================================
echo   탑승 수속 준비가 완료되었습니다! 즐거운 비행 되세요 ✈
echo ========================================================
timeout /t 3 > nul
