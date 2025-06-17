#!/bin/bash

RETRIES=3
TIMEOUT=10

activate_venv="../venv/bin/activate"
if [[ -f "$activate_venv" ]]; then
    source "$activate_venv"
else
    echo " Virtual environment not found. Skipping activation."
fi

download_file () {
    local FILE_ID=$1
    local FILE_NAME=$2
    local COUNT=0

    if [[ -f "$FILE_NAME" ]]; then
        echo " $FILE_NAME already exists. Skipping download..."
        return 0
    fi

    while [[ $COUNT -lt $RETRIES ]]; do
        COUNT=$((COUNT + 1))
        echo " Attempt $COUNT to download $FILE_NAME..."

        gdown --fuzzy --no-cookies --id "$FILE_ID" --output "$FILE_NAME"

        if [[ -f "$FILE_NAME" ]]; then
            echo " Successfully downloaded $FILE_NAME."
            return 0
        else
            echo " Failed. Retrying in $TIMEOUT seconds..."
            sleep $TIMEOUT
        fi
    done

    echo " Download failed after $RETRIES attempts."
    return 1
}

# === Downloads ===
download_file "1HaaK_fPnMzS6-xMdUTCxwhiZZRWGx_4p" "train.csv"
download_file "1XT80AACe6HeQoQzXJ5iw7HYRNNioUXkw" "test.csv"
