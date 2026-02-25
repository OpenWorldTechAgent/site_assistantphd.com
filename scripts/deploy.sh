#!/bin/bash

# Assistant, PhD - Cloud Run Deployment Script
# Automates the build and deployment process

# Exit on error
set -e

# Navigate to project root
cd "$(dirname "$0")/.."

# Configuration
PROJECT_ID="gen-lang-client-0084107204"
REGION="us-west1"
SERVICE_NAME="assistant-phd-com"
IMAGE_NAME="us-west1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/$SERVICE_NAME:latest"
APP_URL="https://assistant-phd-com-240147801679.us-west1.run.app"

# Load local .env if it exists (to get API key)
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

GEMINI_API_KEY=${VITE_GEMINI_API_KEY}

if [ -z "$GEMINI_API_KEY" ]; then
    echo "Error: VITE_GEMINI_API_KEY not found in .env or environment."
    exit 1
fi

echo "🚀 Starting deployment for $SERVICE_NAME..."

# 1. Build locally first to ensure no errors
echo "📦 Building project locally..."
npm run build

# 2. Submit build to Google Cloud
echo "☁️  Building container in Google Cloud..."
gcloud builds submit --tag "$IMAGE_NAME" --project="$PROJECT_ID"

# 3. Deploy to Cloud Run
echo "🌍 Deploying to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" 
    --image "$IMAGE_NAME" 
    --project="$PROJECT_ID" 
    --region="$REGION" 
    --set-env-vars="VITE_GEMINI_API_KEY=$GEMINI_API_KEY,APP_URL=$APP_URL" 
    --quiet

echo "✅ Deployment successful!"
echo "🔗 URL: $APP_URL"
