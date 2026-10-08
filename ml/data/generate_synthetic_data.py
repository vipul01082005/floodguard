import numpy as np
import pandas as pd
import os

# SYNTHETIC DATA — Generated for model development. Not real observations.
def generate_data(num_samples=10000, seed=42, output_dir='data'):
    np.random.seed(seed)
    
    rainfall_1h = np.random.uniform(0, 100, num_samples)
    rainfall_3h = rainfall_1h + np.random.uniform(0, 100, num_samples)
    rainfall_6h = rainfall_3h + np.random.uniform(0, 150, num_samples)
    rainfall_24h = rainfall_6h + np.random.uniform(0, 150, num_samples)
    
    forecast_rainfall = np.random.uniform(0, 150, num_samples)
    rainfall_intensity = np.random.uniform(0, 1, num_samples)
    historical_flood_count = np.random.randint(0, 21, num_samples)
    recent_reports = np.random.randint(0, 51, num_samples)
    drainage_vulnerability = np.random.uniform(0, 1, num_samples)
    elevation_risk = np.random.uniform(0, 1, num_samples)
    
    # Calculate flood probability based on correlations
    flood_prob = (
        0.3 * (rainfall_24h / 500) +
        0.2 * drainage_vulnerability +
        0.2 * elevation_risk +
        0.1 * (historical_flood_count / 20) +
        0.1 * (recent_reports / 50) +
        0.1 * rainfall_intensity
    )
    
    # Add noise
    noise = np.random.normal(0, 0.1, num_samples)
    flood_prob = np.clip(flood_prob + noise, 0, 1)
    
    # Threshold for actual flood
    flood_occurred = (flood_prob > 0.55).astype(int)
    
    df = pd.DataFrame({
        'rainfall_1h': rainfall_1h,
        'rainfall_3h': rainfall_3h,
        'rainfall_6h': rainfall_6h,
        'rainfall_24h': rainfall_24h,
        'forecast_rainfall': forecast_rainfall,
        'rainfall_intensity': rainfall_intensity,
        'historical_flood_count': historical_flood_count,
        'recent_reports': recent_reports,
        'drainage_vulnerability': drainage_vulnerability,
        'elevation_risk': elevation_risk,
        'flood_occurred': flood_occurred
    })
    
    os.makedirs(output_dir, exist_ok=True)
    df.to_csv(os.path.join(output_dir, 'synthetic_flood_data.csv'), index=False)
    print("Generated 10,000 synthetic samples.")
    
    # Save data dictionary
    data_dict = """# Data Dictionary

This dataset uses SYNTHETIC data for development. It does not represent real observations.

- `rainfall_1h`: Rainfall in the last hour (mm)
- `rainfall_3h`: Rainfall in the last 3 hours (mm)
- `rainfall_6h`: Rainfall in the last 6 hours (mm)
- `rainfall_24h`: Rainfall in the last 24 hours (mm)
- `forecast_rainfall`: Forecasted rainfall for the next 24 hours (mm)
- `rainfall_intensity`: Measure of rainfall intensity (0-1)
- `historical_flood_count`: Number of historical floods in the area
- `recent_reports`: Number of recent flood reports from users/sensors
- `drainage_vulnerability`: Vulnerability of the local drainage system (0-1)
- `elevation_risk`: Risk based on elevation (0-1, 1 is lowest elevation/highest risk)
- `flood_occurred`: Target variable (1 if flood occurred, 0 otherwise)
"""
    with open(os.path.join(output_dir, 'data_dictionary.md'), 'w') as f:
        f.write(data_dict)

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    generate_data(output_dir=current_dir)
