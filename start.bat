@echo off
setlocal

set PROJECT_DIR=%~dp0anicare-ai
set ENV_NAME=CARIC

:: Check if Node.js is available
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo [ERROR] Node.js not found. Please install Node.js 18+ from https://nodejs.org/
  pause
  exit /b 1
)

:: Try activate conda environment if available
for /f "delims=" %%i in ('where conda 2^>nul') do set CONDA_CMD=conda
if defined CONDA_CMD (
  call %CONDA_CMD% activate %ENV_NAME% 2>nul
)

:: Install dependencies if node_modules not exists
if not exist "%PROJECT_DIR%\node_modules" (
  echo [INFO] Installing frontend dependencies...
  pushd "%PROJECT_DIR%"
  call npm install --legacy-peer-deps
  if %ERRORLEVEL% neq 0 (
    echo [ERROR] npm install failed. Please check your network and try again.
    pause
    exit /b 1
  )
  popd
)

:: Start Next.js dev server
echo [INFO] Starting AniCare AI dev server at http://localhost:3000 ...
pushd "%PROJECT_DIR%"
start "" http://localhost:3000
call npm run dev
popd

endlocal
