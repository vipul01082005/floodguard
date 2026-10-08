import numpy as np
import joblib
import os

MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'training')
PREP_DIR = os.path.join(os.path.dirname(__file__), '..', 'preprocessing')

_model = None
_scaler = None
_feature_names = None
_threshold = 0.5
_importance = None

def load_model():
    global _model, _scaler, _feature_names, _threshold, _importance
    _model = joblib.load(os.path.join(MODEL_DIR, 'flood_risk_model.joblib'))
    _scaler = joblib.load(os.path.join(PREP_DIR, 'scaler.joblib'))
    _feature_names = joblib.load(os.path.join(PREP_DIR, 'feature_names.joblib'))
    try:
        _threshold = joblib.load(os.path.join(MODEL_DIR, 'threshold.joblib'))
    except:
        _threshold = 0.5
    _importance = joblib.load(os.path.join(MODEL_DIR, 'feature_importance.joblib'))

def calculate_derived_features(features):
    rf_1h = features.get('rainfall_1h', 0)
    rf_3h = features.get('rainfall_3h', 0)
    rf_24h = features.get('rainfall_24h', 0)
    dv = features.get('drainage_vulnerability', 0)
    rr = features.get('recent_reports', 0)
    hfc = features.get('historical_flood_count', 0)
    
    trend = rf_1h / max(rf_3h / 3, 0.1)
    cum_risk = rf_24h * dv
    density = rr * (1 + hfc / 10)
    
    return trend, cum_risk, density

def predict_flood_risk(features: dict) -> dict:
    if _model is None:
        load_model()
        
    trend, cum_risk, density = calculate_derived_features(features)
    
    full_features = dict(features)
    full_features['rainfall_trend'] = trend
    full_features['cumulative_risk'] = cum_risk
    full_features['report_density'] = density
    
    vec = [full_features.get(f, 0) for f in _feature_names]
    
    scaled_vec = _scaler.transform([vec])
    prob = _model.predict_proba(scaled_vec)[0, 1]
    
    risk_score = prob * 100
    
    if prob >= _threshold:
        risk_level = "HIGH" if prob > _threshold + 0.2 else "MODERATE"
        if prob > _threshold + 0.4:
            risk_level = "SEVERE"
    else:
        risk_level = "LOW"
        
    confidence = "HIGH" if abs(prob - _threshold) > 0.15 else "LOW"
    
    top_factors = sorted(_importance.keys(), key=lambda k: _importance[k] * abs(full_features.get(k, 0)), reverse=True)[:3]
    
    risk_window = "Immediate (0-2h)" if trend > 1.5 else "Short-term (2-6h)"
    
    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "probability": prob,
        "confidence": confidence,
        "top_factors": top_factors,
        "risk_window": risk_window
    }

def predict_batch(features_list) -> list:
    return [predict_flood_risk(f) for f in features_list]
