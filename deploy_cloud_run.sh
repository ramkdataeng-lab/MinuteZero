#!/bin/bash

# MinuteZero: Google Cloud Run Deployment Automation
# This script automates the containerization and deployment of the MinuteZero Live Agent.

# 1. Configuration
PROJECT_ID=$(gcloud config get-value project)
SERVICE_NAME="minute-zero-agent"
REGION="us-central1"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "🚀 Starting Deployment for $SERVICE_NAME to Google Cloud Run..."

# 2. Build the container using Cloud Build
echo "📦 Building container image..."
gcloud builds submit --tag $IMAGE_NAME ./resq-agent

# 3. Deploy to Cloud Run
echo "🌍 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars "GOOGLE_CLOUD_PROJECT=$PROJECT_ID,GOOGLE_CLOUD_LOCATION=$REGION"

echo "✅ MinuteZero Agent is live on Google Cloud Run!"
