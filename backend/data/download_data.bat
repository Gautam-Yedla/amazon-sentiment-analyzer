@echo off
setlocal

set RETRIES=3
set COUNT=0

:: File IDs and names
set TRAIN_ID=1HaaK_fPnMzS6-xMdUTCxwhiZZRWGx_4p
set TEST_ID=1XT80AACe6HeQoQzXJ5iw7HYRNNioUXkw

set TRAIN_FILE=train.csv
set TEST_FILE=test.csv

:: Activate venv
call ..\venv\Scripts\activate.bat

:: Function to download with retries
:download_file
set FILE_ID=%1
set FILE_NAME=%2
set COUNT=0

if exist %FILE_NAME% (
    echo ✅ %FILE_NAME% already exists. Skipping download.
    goto :eof
)

:retry
set /a COUNT+=1
echo Attempt %COUNT% to download %FILE_NAME%

gdown --fuzzy --no-cookies --id %FILE_ID% --output %FILE_NAME%

if exist %FILE_NAME% (
    echo ✅ %FILE_NAME% downloaded successfully.
    goto :eof
)

if %COUNT% LSS %RETRIES% (
    echo ❌ Failed to download %FILE_NAME%. Retrying in 10s...
    timeout /T 10 >nul
    goto retry
) else (
    echo ❌ Download failed for %FILE_NAME% after %RETRIES% attempts.
    exit /b 1
)

:end
exit /b 0
goto :eof

:: Download both files
call :download_file %TRAIN_ID% %TRAIN_FILE%
call :download_file %TEST_ID% %TEST_FILE%
