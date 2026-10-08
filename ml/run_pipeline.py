import argparse
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from data.generate_synthetic_data import generate_data
from preprocessing.preprocess import preprocess_data
from training.train_model import train
from evaluation.evaluate_model import evaluate
from inference.export_model import export_model

def main():
    parser = argparse.ArgumentParser(description="Run FloodGuard ML Pipeline")
    parser.add_argument('--skip-data-gen', action='store_true', help="Skip synthetic data generation")
    args = parser.parse_args()
    
    print("--- Starting FloodGuard ML Pipeline ---")
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    if not args.skip_data_gen:
        print("\\n[1/5] Generating Synthetic Data...")
        generate_data(output_dir=os.path.join(base_dir, 'data'))
    else:
        print("\\n[1/5] Skipping Data Generation.")
        
    print("\\n[2/5] Preprocessing Data...")
    preprocess_data(input_path=os.path.join(base_dir, 'data', 'synthetic_flood_data.csv'), output_dir=os.path.join(base_dir, 'preprocessing'))
    
    print("\\n[3/5] Training Model...")
    train(data_dir=os.path.join(base_dir, 'preprocessing'), output_dir=os.path.join(base_dir, 'training'))
    
    print("\\n[4/5] Evaluating Model...")
    evaluate(data_dir=os.path.join(base_dir, 'preprocessing'), model_dir=os.path.join(base_dir, 'training'), output_dir=os.path.join(base_dir, 'evaluation'))
    
    print("\\n[5/5] Exporting Model...")
    export_model()
    
    print("\\n--- Pipeline Execution Complete ---")

if __name__ == "__main__":
    main()
