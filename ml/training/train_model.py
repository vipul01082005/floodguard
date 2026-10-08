import numpy as np
import os
import joblib
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from xgboost import XGBClassifier
from sklearn.model_selection import GridSearchCV

def train(data_dir='../preprocessing', output_dir='.'):
    X_train = np.load(os.path.join(data_dir, 'X_train.npy'))
    y_train = np.load(os.path.join(data_dir, 'y_train.npy'))
    feature_names = joblib.load(os.path.join(data_dir, 'feature_names.joblib'))
    
    models = {
        'RandomForest': (RandomForestClassifier(random_state=42), {
            'n_estimators': [50, 100],
            'max_depth': [5, 10, None]
        }),
        'GradientBoosting': (GradientBoostingClassifier(random_state=42), {
            'n_estimators': [50, 100],
            'learning_rate': [0.01, 0.1]
        }),
        'XGBoost': (XGBClassifier(random_state=42, use_label_encoder=False, eval_metric='logloss'), {
            'n_estimators': [50, 100],
            'max_depth': [3, 5]
        })
    }
    
    best_model = None
    best_score = 0
    best_name = ""
    
    for name, (model, params) in models.items():
        print(f"Training {name}...")
        grid = GridSearchCV(model, params, cv=5, scoring='recall', n_jobs=-1)
        grid.fit(X_train, y_train)
        
        print(f"{name} best recall score: {grid.best_score_:.4f}")
        if grid.best_score_ > best_score:
            best_score = grid.best_score_
            best_model = grid.best_estimator_
            best_name = name
            
    print(f"\\nSelected Best Model: {best_name} with score {best_score:.4f}")
    
    os.makedirs(output_dir, exist_ok=True)
    joblib.dump(best_model, os.path.join(output_dir, 'flood_risk_model.joblib'))
    
    importances = best_model.feature_importances_
    importance_dict = dict(zip(feature_names, importances))
    joblib.dump(importance_dict, os.path.join(output_dir, 'feature_importance.joblib'))
    
    print("Training complete. Model and feature importances saved.")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    prep_dir = os.path.join(current_dir, '..', 'preprocessing')
    train(data_dir=prep_dir, output_dir=current_dir)
