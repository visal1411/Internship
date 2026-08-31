# Quickstart

## Prerequisites
- Python 3.10+
- Install dependencies: `pip install -r requirements.txt` (FastAPI, uvicorn, scikit-learn, pandas)

## Train the Model
1. Place `cattle_dataset.csv` in the root `ML_Train/` directory.
2. Run the training script: `python train.py`
3. Verify that the serialized model file `model.pkl` is successfully generated in the same directory.

## Run the Prediction Server
1. Start the FastAPI server: `uvicorn main:app --reload --port 5000`
2. Test the API locally using `curl`:
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"breed": "Angus", "age_months": 24, "weight_kg": 650.5}'
```
3. You should see a response like:
```json
{"label": "healthy", "confidence": 0.89}
```
