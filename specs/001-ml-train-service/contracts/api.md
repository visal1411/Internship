# Prediction API Contract

**POST** `/predict`
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "breed": "Angus",
  "age_months": 24,
  "weight_kg": 650.5
}
```

**Response (200 OK):**
```json
{
  "label": "healthy",
  "confidence": 0.92
}
```

**Response (400 Bad Request):**
```json
{
  "detail": [
    {
      "loc": ["body", "weight_kg"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```
