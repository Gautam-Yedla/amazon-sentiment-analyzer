@echo off
setlocal enabledelayedexpansion

:: Activate virtual environment
if exist "..\venv\Scripts\activate.bat" (
    call ..\venv\Scripts\activate.bat
) else (
    echo ⚠️  Virtual environment not found. Skipping activation.
)


:: Set retry attempts
set RETRIES=3
set TIMEOUT=10

:: === Download train.csv ===
set FILE_ID=1HaaK_fPnMzS6-xMdUTCxwhiZZRWGx_4p
set FILE_NAME=train.csv
if exist %FILE_NAME% (
    echo ✅ %FILE_NAME% already exists. Skipping download...
) else (
    set COUNT=0
    :retry_train
    set /a COUNT+=1
    echo 🔄 Attempt !COUNT! to download %FILE_NAME%...

    gdown --fuzzy --no-cookies --id %FILE_ID% --output %FILE_NAME%
    if exist %FILE_NAME% (
        echo ✅ Successfully downloaded %FILE_NAME%.
    ) else (
        if !COUNT! LSS %RETRIES% (
            echo ❌ Failed to download. Retrying in %TIMEOUT% seconds...
            timeout /T %TIMEOUT% >nul
            goto retry_train
        ) else (
            echo ❌ Download failed after %RETRIES% attempts.
            exit /b 1
        )
    )
)

:: === Download test.csv ===
set FILE_ID=1XT80AACe6HeQoQzXJ5iw7HYRNNioUXkw
set FILE_NAME=test.csv
if exist %FILE_NAME% (
    echo ✅ %FILE_NAME% already exists. Skipping download...
) else (
    set COUNT=0
    :retry_test
    set /a COUNT+=1
    echo 🔄 Attempt !COUNT! to download %FILE_NAME%...

    gdown --fuzzy --no-cookies --id %FILE_ID% --output %FILE_NAME%
    if exist %FILE_NAME% (
        echo ✅ Successfully downloaded %FILE_NAME%.
    ) else (
        if !COUNT! LSS %RETRIES% (
            echo ❌ Failed to download. Retrying in %TIMEOUT% seconds...
            timeout /T %TIMEOUT% >nul
            goto retry_test
        ) else (
            echo ❌ Download failed after %RETRIES% attempts.
            exit /b 1
        )
    )
)

exit /b 0
