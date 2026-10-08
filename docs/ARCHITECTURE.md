# Architecture Overview

## System Overview
FloodGuard leverages a fully serverless architecture on AWS to ensure high availability, scalability, and cost-effectiveness, critical during unpredictable weather events.

## Architecture Diagram
*(See README.md for text-based flow, or imagine a standard Serverless Web App diagram here)*
- **Frontend Layer:** React SPA hosted on S3, distributed by CloudFront.
- **API Layer:** API Gateway.
- **Compute Layer:** AWS Lambda (Node.js).
- **Data Layer:** DynamoDB for fast, flexible NoSQL storage; S3 for image objects.
- **Auth Layer:** Amazon Cognito.
- **Event/Notification Layer:** EventBridge for scheduling, SNS for push/SMS alerts.

## Request Flow
1.  User authenticates via Cognito.
2.  Client sends HTTPS request to API Gateway with JWT.
3.  API Gateway validates token and routes to specific Lambda.
4.  Lambda interacts with DynamoDB/S3.
5.  Lambda returns response to API Gateway -> Client.

## Data Flow
- **Reports:** Client -> Lambda -> DynamoDB (metadata) & S3 (image).
- **Alerts:** EventBridge triggers Lambda -> queries DynamoDB for high-risk zones -> publishes to SNS -> users notified.

## AWS Services
*   **API Gateway:** Request routing, throttling, CORS.
*   **Lambda:** Stateless compute, scales automatically.
*   **DynamoDB:** Millisecond latency at any scale.
*   **S3:** Durable storage for images and static assets.
*   **CloudFront:** Global CDN for low-latency frontend delivery.
*   **Cognito:** Secure user directory and authentication.
*   **SNS:** High-throughput pub/sub for alerts.

## Security Boundaries
- API endpoints protected by Cognito Authorizers.
- IAM roles restrict Lambda functions to specific resources (Least Privilege).
- S3 buckets block public access; frontend served via OAI.

## ML Pipeline
- Offline training (Python) generates models.
- In production, models are converted/exported and loaded by Lambda, or pre-computed predictions are stored in DynamoDB for real-time access.

## Failure Handling Strategy
- API Gateway rate limiting prevents DDoS.
- DynamoDB Point-in-Time Recovery.
- CloudWatch Alarms for Lambda error rates.

## Scalability Considerations
- Serverless components inherently scale.
- DynamoDB set to PAY_PER_REQUEST (On-Demand) to handle traffic spikes.

## Cost Analysis (Free Tier Focus)
- Lambda: 1M free requests/month.
- API Gateway: 1M free calls/month for first year.
- DynamoDB: 25GB free storage forever.
- Architecture is designed to cost near $0 during idle times.
