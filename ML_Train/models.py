from pydantic import BaseModel

class PredictionRequest(BaseModel):
    breed: str
    age_months: float
    gender: str
    weight_kg: float

class PredictionResponse(BaseModel):
    label: str
    confidence: float
