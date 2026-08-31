# Cow Dashboard ML Train Service

This directory contains the standalone Python Machine Learning service for the Cow Dashboard. It is responsible for training a Decision Tree Classifier on cow metadata and serving predictions via a FastAPI endpoint.

## Prerequisites

- Python 3.10+
- The `cattle_dataset.csv` file must be present in this directory.

## Setup

It is highly recommended to use a Python virtual environment to avoid dependency conflicts.

1. Create and activate a virtual environment:
   ```bash
   # Windows
   python -m venv .venv
   .\.venv\Scripts\activate
   
   # macOS/Linux
   python3 -m venv .venv
   source .venv/bin/activate
   ```

2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## 1. How to Train the Model

Before starting the server, you must train the model so it can generate the `model.pkl` artifact.

Run the training script:
```bash
python train.py
```

**Expected Output:**
You should see it load the dataset, build the preprocessing pipeline, train the Decision Tree, and report the training accuracy. Finally, it will say `Done!` and save the `model.pkl` file in this directory.

## 2. How to Run the Prediction Server

Once `model.pkl` is generated, you can start the FastAPI server to serve predictions.

Start the server using `uvicorn`:
```bash
uvicorn main:app --reload --port 5000
```

**Expected Output:**
The server will start on `http://127.0.0.1:5000`. You will see a log indicating `Model loaded successfully.`

## 3. How to Test the API

With the server running, you can test the `/predict` endpoint by sending a POST request with JSON data.

**Using curl (in a new terminal):**
```bash
curl -X POST http://127.0.0.1:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"breed": "Angus", "age_months": 24, "gender": "Female", "weight_kg": 650.5}'
```

**Expected Response:**
```json
{
  "label": "healthy",
  "confidence": 0.89
}
```

**Interactive Docs:**
FastAPI automatically generates a beautiful UI to test the API. 
Open your browser and navigate to: [http://127.0.0.1:5000/docs](http://127.0.0.1:5000/docs)
You can use this page to click **"Try it out"**, enter a JSON payload, and see the response visually!
