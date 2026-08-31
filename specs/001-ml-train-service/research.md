# Research: ML Train Service

## Framework Choice: ML Algorithm
- **Decision**: `scikit-learn` (Decision Tree Classifier)
- **Rationale**: The user explicitly preferred a Decision Tree over a Random Forest. A single Decision Tree is perfectly suited for this tabular dataset because it offers **high interpretability**. We can literally visualize the exact IF/THEN rules it learned (e.g., "If Weight > 600kg and Breed == Angus -> Healthy"), which is great for explaining the results to stakeholders.
- **Alternatives**: Random Forest (more robust to overfitting, but acts like a black box and loses the extreme transparency of a single Decision Tree).

## Framework Choice: API Server
- **Decision**: `FastAPI`
- **Rationale**: High performance, built-in data validation with Pydantic (perfect for the PredictionRequest payload validation mentioned in the constitution), and extremely easy to set up.
- **Alternatives**: Flask (slower, requires extra validation plugins), Django (too heavy).

## Preprocessing Strategy
- **Decision**: Categorical Encoding (One-Hot or Label) and Standard Scaling.
- **Rationale**: Breed and Gender are string values, which need to be converted to numeric formats for the ML model. Age and Weight have different scales and need to be normalized.
- **Alternatives**: Leave as-is (Algorithms will fail or underperform).
