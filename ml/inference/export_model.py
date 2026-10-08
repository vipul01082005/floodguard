import joblib
import json
import os

MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'training')
PREP_DIR = os.path.join(os.path.dirname(__file__), '..', 'preprocessing')
EXPORT_DIR = os.path.join(os.path.dirname(__file__), '.')

def export_model():
    model = joblib.load(os.path.join(MODEL_DIR, 'flood_risk_model.joblib'))
    scaler = joblib.load(os.path.join(PREP_DIR, 'scaler.joblib'))
    feature_names = joblib.load(os.path.join(PREP_DIR, 'feature_names.joblib'))
    threshold = joblib.load(os.path.join(MODEL_DIR, 'threshold.joblib'))
    
    if hasattr(model, 'feature_importances_'):
        weights = model.feature_importances_.tolist()
    else:
        weights = [1.0/len(feature_names)] * len(feature_names)
        
    scaler_mean = scaler.mean_.tolist() if hasattr(scaler, 'mean_') else []
    scaler_scale = scaler.scale_.tolist() if hasattr(scaler, 'scale_') else []
    
    export_data = {
        "feature_names": feature_names,
        "weights": weights,
        "thresholds": float(threshold),
        "scaler_params": {
            "mean": scaler_mean,
            "scale": scaler_scale
        },
        "note": "Weights provided are feature importances for frontend fallback approximation."
    }
    
    os.makedirs(EXPORT_DIR, exist_ok=True)
    with open(os.path.join(EXPORT_DIR, 'model_export.json'), 'w') as f:
        json.dump(export_data, f, indent=2)
        
    print("Model exported to JSON for frontend usage.")

if __name__ == "__main__":
    export_model()
