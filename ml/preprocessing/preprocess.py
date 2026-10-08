import pandas as pd
import numpy as np
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

def preprocess_data(input_path='../data/synthetic_flood_data.csv', output_dir='.'):
    df = pd.read_csv(input_path)
    
    # Handle missing values
    df.fillna(df.median(), inplace=True)
    
    # Feature engineering
    df['rainfall_trend'] = df['rainfall_1h'] / np.maximum(df['rainfall_3h'] / 3, 0.1)
    df['cumulative_risk'] = df['rainfall_24h'] * df['drainage_vulnerability']
    df['report_density'] = df['recent_reports'] * (1 + df['historical_flood_count'] / 10)
    
    X = df.drop('flood_occurred', axis=1)
    y = df['flood_occurred']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    os.makedirs(output_dir, exist_ok=True)
    
    np.save(os.path.join(output_dir, 'X_train.npy'), X_train_scaled)
    np.save(os.path.join(output_dir, 'X_test.npy'), X_test_scaled)
    np.save(os.path.join(output_dir, 'y_train.npy'), y_train)
    np.save(os.path.join(output_dir, 'y_test.npy'), y_test)
    
    joblib.dump(scaler, os.path.join(output_dir, 'scaler.joblib'))
    joblib.dump(X.columns.tolist(), os.path.join(output_dir, 'feature_names.joblib'))
    
    print("Preprocessing complete. Saved scaled data and scaler.")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_file = os.path.join(current_dir, '..', 'data', 'synthetic_flood_data.csv')
    preprocess_data(input_path=data_file, output_dir=current_dir)
