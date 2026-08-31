import os
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from models import PredictionRequest, PredictionResponse

app = FastAPI(title="ML Train Service")

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")
model_pipeline = None

@app.on_event("startup")
def load_model():
    global model_pipeline
    if os.path.exists(MODEL_PATH):
        model_pipeline = joblib.load(MODEL_PATH)
        print("Model loaded successfully.")
    else:
        print(f"Warning: Model not found at {MODEL_PATH}. Run train.py first.")

@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    if model_pipeline is None:
        raise HTTPException(status_code=503, detail="Model not trained yet. Run train.py.")
    
    # Create DataFrame for prediction
    df = pd.DataFrame([{
        "Breed": request.breed,
        "Age": request.age_months,
        "Gender": request.gender,
        "Weight": request.weight_kg
    }])
    
    try:
        prediction = model_pipeline.predict(df)[0]
        probabilities = model_pipeline.predict_proba(df)[0]
        confidence = max(probabilities)
        
        # Ensure standard case for the node backend
        return PredictionResponse(label=str(prediction).lower(), confidence=float(confidence))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
