# Security Documentation

## Authentication (Cognito)
- User authentication is managed by Amazon Cognito.
- Password policy enforced (min 8 chars, uppercase, number).
- JWT tokens used for API access.

## Authorization (RBAC)
- API endpoints validated against user claims.
- Future implementation: Admin vs Standard user roles.

## IAM (Least Privilege)
- Every Lambda function has a dedicated IAM role.
- Roles grant access ONLY to required specific resources (e.g., read-only on specific DynamoDB table).

## Data Protection
- DynamoDB tables encrypted at rest (AWS_OWNED_KMS).
- S3 buckets encrypted with AES256.
- Data in transit encrypted via HTTPS.

## S3 Security
- Public access blocked on all buckets.
- Frontend bucket accessed only via CloudFront Origin Access Identity (OAI).

## API Security
- **Rate Limiting & Throttling:** 100 burst, 50 rate limit configured in API Gateway to prevent abuse.
- **CORS:** Strictly configured to allow specific origins.

## Input Validation
- All API inputs validated at the Lambda layer before processing.

## Privacy (Data Minimization)
- Only essential user data (email, location for alerts) is stored.

## Secret Management
- Secrets and environment variables managed via AWS Systems Manager Parameter Store or Lambda Environment Variables (for non-sensitive config).

## Logging and Monitoring
- CloudWatch Logs for all Lambda executions.
- CloudWatch Alarms configured for error thresholds.

## Threat Model & Mitigations
*   **Fake reports:** Mitigated by user authentication and reputation scoring (future).
*   **Spam:** Rate limiting on report creation.
*   **Unauthorized access:** Cognito and IAM.
*   **Malicious uploads:** S3 bucket policies, optional anti-virus scanning on put.
*   **API abuse:** API Gateway throttling.
*   **Location privacy:** Location data stored securely, obfuscated where necessary.

## Known Limitations
- Currently relies on single-region deployment.
