# Data Model

## DatasetRecord
Fields from `cattle_dataset.csv`:
- `Breed` (String)
- `Age` (Integer months)
- `Gender` (String: Male/Female)
- `Weight` (Float kg)
- `Status` (String: Healthy/Overweight/Underweight)

## API Data Models (FastAPI / Pydantic)

### PredictionRequest
Used to validate the incoming POST request to `/predict`.
- `breed`: string
- `age_months`: float
- `weight_kg`: float

### PredictionResponse
Returned to the Node.js backend upon successful prediction.
- `label`: string (e.g., "healthy", "overweight")
- `confidence`: float (e.g., 0.95)
