# Machine Learning Documentation

## Approach Overview
FloodGuard uses historical weather data, topological information, and urban infrastructure metrics to predict localized flood probabilities.

## Feature Descriptions
- **Precipitation:** Last 24h, predicted next 24h.
- **Topography:** Elevation, slope, proximity to water bodies.
- **Urban Density:** Impervious surface area percentage.
- **Drainage Capacity:** Historical data on infrastructure limits.

## Model Selection
- Currently utilizing Random Forest classification for robust handling of non-linear features.
- Future considerations: Deep Learning (LSTMs) for time-series precipitation data.

## Training Pipeline
- Data ingestion -> Preprocessing (normalization, imputation) -> Feature Engineering -> Model Training -> Validation (K-fold).

## Evaluation Metrics
- Accuracy, Precision, Recall, F1-Score. High recall is prioritized to minimize false negatives (failing to predict a flood).

## Interpretability
- Explainable AI (XAI) techniques (like SHAP values) are used to provide reasons for high risk (e.g., "High Risk due to 80% expected rainfall and low elevation").

## Confidence Scoring
- Predictions are accompanied by a confidence interval to inform users of the certainty of the assessment.

## Synthetic Data Disclaimer
- **Note:** Initial demo versions may use synthetic data to simulate various flooding scenarios.

## Future: Real Data Integration
- Integration with live meteorological APIs (NOAA, local weather services) and live river gauge sensors.
