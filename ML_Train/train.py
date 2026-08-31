import os
import pandas as pd
import joblib
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

def train():
    # Load dataset
    data_path = os.path.join(os.path.dirname(__file__), "cattle_dataset.csv")
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Dataset not found at {data_path}")
        
    print(f"Loading dataset from {data_path}...")
    df = pd.read_csv(data_path)
    
    # Check required columns
    required_cols = ["Breed", "Age", "Gender", "Weight", "Status"]
    for col in required_cols:
        if col not in df.columns:
            raise ValueError(f"Missing required column: {col}")
            
    # Prepare features and target
    X = df[["Breed", "Age", "Gender", "Weight"]]
    y = df["Status"]
    
    print("Building preprocessing pipeline...")
    # Preprocessing
    # Breed and Gender are categorical
    categorical_features = ["Breed", "Gender"]
    categorical_transformer = OneHotEncoder(handle_unknown='ignore')
    
    # Age and Weight are numerical
    numeric_features = ["Age", "Weight"]
    numeric_transformer = StandardScaler()
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ])
        
    print("Initializing Decision Tree Classifier...")
    # Model
    model = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', DecisionTreeClassifier(max_depth=5, random_state=42))
    ])
    
    print("Training model...")
    model.fit(X, y)
    
    accuracy = model.score(X, y)
    print(f"Training completed. Training Accuracy: {accuracy:.2%}")
    
    model_path = os.path.join(os.path.dirname(__file__), "model.pkl")
    print(f"Saving model to {model_path}...")
    joblib.dump(model, model_path)
    print("Done!")

if __name__ == "__main__":
    train()
