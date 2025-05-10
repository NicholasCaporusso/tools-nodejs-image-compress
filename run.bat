@echo off
setlocal EnableDelayedExpansion

:: Determine script directory
set "SCRIPT_DIR=%~dp0"

:: Prompt for input folder
set /p INPUT="Enter input folder path: "

:: Prompt for output folder
set /p OUTPUT="Enter output folder path: "

:: Prompt for recursion (Enter for yes, N/n for no)
set /p RECURSE="Run recursively? (Enter for yes, N/n for no): "
if /I "!RECURSE!"=="N" (
  set "RECURSE_FLAG="
) else (
  set "RECURSE_FLAG=-r"
)

:: Execute Node.js compressor
node "!SCRIPT_DIR!app.js" -i "!INPUT!" -o "!OUTPUT!" !RECURSE_FLAG!

if errorlevel 1 (
  echo.
  echo An error occurred running the Node.js script.
) else (
  echo.
  echo Compression completed successfully.
)

pause
endlocal