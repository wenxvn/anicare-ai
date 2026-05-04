@echo off
setlocal

set PROJECT_DIR=%~dp0anicare-ai
set ENV_NAME=CARIC
set PORT=3000

where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo [ERROR] Node.js not found. Please install Node.js 18+ from https://nodejs.org/
  pause
  exit /b 1
)

for /f "delims=" %%i in ('where conda 2^>nul') do set CONDA_CMD=conda
if defined CONDA_CMD (
  call %CONDA_CMD% activate %ENV_NAME% 2>nul
)

if not exist "%PROJECT_DIR%\node_modules" (
  echo [INFO] Installing frontend dependencies...
  pushd "%PROJECT_DIR%"
  call npm install --legacy-peer-deps
  if %ERRORLEVEL% neq 0 (
    echo [ERROR] npm install failed.
    pause
    exit /b 1
  )
  popd
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%PORT% " ^| findstr "LISTENING"') do (
  echo [INFO] Port %PORT% is in use by PID %%a, killing...
  taskkill /F /PID %%a >nul 2>nul
)

echo [INFO] Starting AniCare AI dev server on port %PORT% ...
pushd "%PROJECT_DIR%"
start "AniCare Dev" cmd /c "npx next dev -p %PORT%"

echo [INFO] Waiting for server to be ready...
powershell -Command "while (-not (Test-NetConnection -ComputerName localhost -Port %PORT% -WarningAction SilentlyContinue).TcpTestSucceeded) { Start-Sleep -Milliseconds 500 }"

echo [INFO] Server is ready! Opening browser...
start "" http://localhost:%PORT%

echo.
echo [INFO] Press any key to close this launcher (server keeps running in its window).
pause >nul

popd
endlocal
