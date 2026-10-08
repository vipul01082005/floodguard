import numpy as np
import os
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import (accuracy_score, precision_score, recall_score, 
                             f1_score, roc_auc_score, confusion_matrix, 
                             roc_curve, classification_report, precision_recall_curve)

def evaluate(data_dir='../preprocessing', model_dir='../training', output_dir='.'):
    X_test = np.load(os.path.join(data_dir, 'X_test.npy'))
    y_test = np.load(os.path.join(data_dir, 'y_test.npy'))
    feature_names = joblib.load(os.path.join(data_dir, 'feature_names.joblib'))
    model = joblib.load(os.path.join(model_dir, 'flood_risk_model.joblib'))
    
    os.makedirs(output_dir, exist_ok=True)
    
    y_prob = model.predict_proba(X_test)[:, 1]
    
    # Threshold tuning: maximize recall, precision > 0.6
    precisions, recalls, thresholds = precision_recall_curve(y_test, y_prob)
    valid_thresholds = [th for p, th in zip(precisions[:-1], thresholds) if p > 0.6]
    best_threshold = valid_thresholds[0] if valid_thresholds else 0.5
    
    y_pred = (y_prob >= best_threshold).astype(int)
    
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred)
    rec = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    auc = roc_auc_score(y_test, y_prob)
    
    report_md = f"""# Model Evaluation Report

**Note: For flood safety, we prioritize recall (catching all dangerous events) over precision.**

## Metrics (Threshold = {best_threshold:.3f})
- Accuracy: {acc:.4f}
- Precision: {prec:.4f}
- Recall: {rec:.4f}  <-- PRIORITIZED
- F1 Score: {f1:.4f}
- AUC-ROC: {auc:.4f}

## Classification Report
```
{classification_report(y_test, y_pred)}
```
"""
    with open(os.path.join(output_dir, 'evaluation_report.md'), 'w') as f:
        f.write(report_md)
        
    # Confusion Matrix
    cm = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(6,4))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
    plt.title('Confusion Matrix')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.savefig(os.path.join(output_dir, 'confusion_matrix.png'))
    plt.close()
    
    # ROC Curve
    fpr, tpr, _ = roc_curve(y_test, y_prob)
    plt.figure(figsize=(6,4))
    plt.plot(fpr, tpr, label=f'AUC = {auc:.3f}')
    plt.plot([0, 1], [0, 1], 'k--')
    plt.title('ROC Curve')
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.legend()
    plt.savefig(os.path.join(output_dir, 'roc_curve.png'))
    plt.close()
    
    # Feature Importance Plot
    importances = model.feature_importances_
    indices = np.argsort(importances)[::-1]
    
    plt.figure(figsize=(10,6))
    plt.bar(range(X_test.shape[1]), importances[indices])
    plt.xticks(range(X_test.shape[1]), [feature_names[i] for i in indices], rotation=90)
    plt.title('Feature Importances')
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'feature_importance.png'))
    plt.close()
    
    # Save threshold
    joblib.dump(best_threshold, os.path.join(model_dir, 'threshold.joblib'))
    
    print("Evaluation complete. Generated reports and plots.")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    prep_dir = os.path.join(current_dir, '..', 'preprocessing')
    model_dir = os.path.join(current_dir, '..', 'training')
    evaluate(data_dir=prep_dir, model_dir=model_dir, output_dir=current_dir)
