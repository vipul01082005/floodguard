# FloodGuard

**Predict, Explain, Warn, Route, Crowdsource.**

## Problem Statement
Urban areas face increasing flood risks due to climate change, overwhelming traditional prediction and response systems. Citizens lack real-time, actionable insights on localized flooding and safe routes.

## Solution Overview
FloodGuard is a comprehensive environmental technology platform that combines machine learning, real-time crowdsourcing, and geospatial routing to provide precise, timely flood risk intelligence to citizens and authorities.

## Key Features
*   **Predict:** ML-powered local flood risk assessment.
*   **Explain:** Explainable AI (XAI) insights into risk factors.
*   **Warn:** Real-time localized alerts via SNS.
*   **Route:** Safe routing comparing multiple paths avoiding high-risk zones.
*   **Crowdsource:** User-reported incidents with image uploads.

## Architecture
```text
Client (React/Tailwind) -> CloudFront -> S3 (Static Assets)
Client -> API Gateway -> Lambda Functions -> DynamoDB (Data) / S3 (Images)
Events -> EventBridge -> Lambda -> SNS (Alerts)
Auth via Cognito
```

## Tech Stack
*   **Frontend:** React, TailwindCSS, TypeScript
*   **Backend:** Node.js, Express, AWS Lambda, API Gateway
*   **Database:** DynamoDB
*   **Storage:** S3
*   **Auth:** Cognito
*   **Infrastructure:** AWS SAM, CloudFormation
*   **ML:** Python, Scikit-learn (Simulated/Offline)

## Quick Start
1.  Clone repository.
2.  `npm install` in both `frontend` and `backend` (if structured as such) or root for monorepo.
3.  Copy `.env.example` to `.env`.
4.  Start local development: `npm run dev`.

## Demo Mode
Set `DEMO_MODE=true` in `.env` to bypass external API requirements and use mock data for rapid testing and demonstrations.

## AWS Deployment
See `docs/DEPLOYMENT.md` for AWS SAM instructions.

## Project Structure
*   `frontend/`: React application.
*   `backend/` or `handlers/`: Lambda functions or express app.
*   `infrastructure/`: AWS SAM templates.
*   `docs/`: Extensive project documentation.
*   `ml/`: Machine learning models and scripts.

## API Documentation
See `docs/API.md` for detailed endpoint definitions.

## Security
See `docs/SECURITY.md` for comprehensive security strategies.

## Environmental Impact
Empowers communities to build resilience against extreme weather events, minimizing economic loss and protecting lives through early warning and informed navigation.

## Hackathon Context
Developed for [Hackathon Name/Context]. Focuses on scalable, serverless architecture to ensure high availability during disaster scenarios.

## Contributing
Contributions are welcome. Please adhere to standard coding practices.

## License
MIT License
