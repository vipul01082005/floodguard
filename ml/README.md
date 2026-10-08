# FloodGuard ML Pipeline

## Overview
This pipeline builds a predictive machine learning model to estimate flood risks based on weather, geographical, and historical data.

**Important Note:** This project uses SYNTHETIC data for development. The architecture supports plugging in real datasets. Never claim synthetic data is real.

## Feature Descriptions
Refer to `data/data_dictionary.md` for complete feature details. Features include rainfall measurements, historical counts, elevation risks, and derived features such as `rainfall_trend` and `cumulative_risk`.

## Model Selection Rationale
We train Random Forest, Gradient Boosting, and XGBoost models. Random Forest or XGBoost typically performs well with tabular data and handles non-linear relationships gracefully. All selected models offer feature importances, fulfilling the requirement for interpretability (no black boxes).

## Training Pipeline Instructions
Run the entire pipeline via:
```bash
python run_pipeline.py
```
This handles data generation, preprocessing, training, evaluation, and exporting.

## Evaluation Metrics
For flood safety, **recall** is prioritized over precision. We aim to catch all dangerous events, minimizing false negatives even at the cost of some false positives. The pipeline automatically tunes the decision threshold to maximize recall while maintaining precision > 0.6.

## How to Retrain with Real Data
1. Replace `data/synthetic_flood_data.csv` with a real dataset.
2. Update the columns in `preprocessing/preprocess.py` if feature names differ.
3. Run `python run_pipeline.py --skip-data-gen`.

## Model Interpretability Approach
- Feature Importances are extracted and saved.
- Top factors for any specific prediction are identified and returned by the inference module.
- Confidence scores are calculated based on the margin from the decision boundary.
