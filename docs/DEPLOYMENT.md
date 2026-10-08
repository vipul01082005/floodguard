# Deployment Guide

## Prerequisites
- AWS CLI configured with administrator access.
- AWS SAM CLI installed.
- Node.js 18.x installed.

## Local Development Setup
1. `npm install`
2. Create `.env` from `.env.example`.
3. Run local API (if express): `npm run dev` or `sam local start-api`.

## AWS Deployment with SAM
1. Build the application:
   ```bash
   sam build
   ```
2. Deploy the application:
   ```bash
   sam deploy --guided
   ```
   *Follow the prompts, using `infrastructure/samconfig.toml` defaults.*

## Environment Configuration
Update Lambda environment variables in AWS console or via SAM parameters for secrets (JWT_SECRET, etc.).

## Post-Deployment Verification
- Verify CloudFormation stack status is `CREATE_COMPLETE`.
- Test API endpoints using Postman or cURL using the outputted `ApiUrl`.
- Verify Frontend URL loads correctly.

## Monitoring Setup
- Check CloudWatch dashboards for API Gateway and Lambda metrics.
- Ensure alarms are set to Active.

## Cost Estimates
Designed to operate well within the AWS Free Tier for low-traffic/demo scenarios. Expected cost < $5/month for minimal usage.
