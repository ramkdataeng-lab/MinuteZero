@echo off
setlocal

echo 🏥 MinuteZero: Google Cloud Compliance Setup
echo --------------------------------------------
echo This script will help you enable the necessary Google Cloud 
echo APIs to ensure your hackathon submission is 100%% compliant.
echo.

:: Check for gcloud CLI
where gcloud >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [!] gcloud CLI not found. Please install the Google Cloud SDK: 
    echo     https://cloud.google.com/sdk/docs/install
    pause
    exit /b
)

echo [*] Log in to Google Cloud...
call gcloud auth login

set /p PROJECT_ID="Enter your Google Cloud Project ID: "
call gcloud config set project %PROJECT_ID%

echo.
echo [*] Enabling required Google Cloud Services...
echo 1. Enabling Google Maps Places API...
call gcloud services enable places.googleapis.com

echo 2. Enabling Google Cloud Storage...
call gcloud services enable storage-component.googleapis.com

echo 3. Enabling Vertex AI (Google Cloud GenAI)...
call gcloud services enable aiplatform.googleapis.com

echo.
echo [*] Creating Cloud Storage Bucket for Clinical Briefings...
set BUCKET_NAME=minutezero-briefings-%PROJECT_ID%
call gcloud storage buckets create gs://%BUCKET_NAME% --location=us-central1

echo.
echo [✅] COMPLIANCE SETUP COMPLETE!
echo.
echo Copy these variables into your resq-agent/.env file:
echo ----------------------------------------------------
echo GOOGLE_CLOUD_PROJECT=%PROJECT_ID%
echo GCP_STORAGE_BUCKET=%BUCKET_NAME%
echo ----------------------------------------------------
echo.
pause
