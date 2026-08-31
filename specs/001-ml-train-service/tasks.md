# Implementation Tasks: ML Train Service

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create ML_Train/ directory structure
- [ ] T002 Initialize `ML_Train/requirements.txt` with `fastapi`, `uvicorn`, `scikit-learn`, `pandas`
- [ ] T003 [P] Add dataset file `cattle_dataset.csv` to `ML_Train/` directory

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [ ] T004 Setup `ML_Train/main.py` with FastAPI application instance
- [ ] T005 [P] Create Pydantic data models (`PredictionRequest`, `PredictionResponse`) in `ML_Train/models.py`

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Prediction Interface (Priority: P1) → MVP

**Goal**: As a backend system, I want to send a cow's metadata to a dedicated prediction service so that I can instantly receive its predicted health classification and a confidence score.

**Independent Test**: Can be fully tested by sending a POST request to `/predict` using `curl` and verifying the JSON response.

### Implementation for User Story 1

- [ ] T006 [P] [US1] Create `/predict` POST endpoint in `ML_Train/main.py` accepting `PredictionRequest`
- [ ] T007 [US1] Implement startup event in `ML_Train/main.py` to load the serialized model (`model.pkl`) if it exists
- [ ] T008 [US1] Implement the prediction logic (passing inputs to the model) and formatting the response
- [ ] T009 [US1] Implement error handling for missing `model.pkl` (503 Service Unavailable)

**Checkpoint**: At this point, User Story 1 should be fully functional (assuming a mock or pre-trained model exists).

---

## Phase 4: User Story 2 - Model Training Execution (Priority: P2)

**Goal**: As a system admin, I want to trigger a training pipeline that reads the dataset file and generates a fresh ML model.

**Independent Test**: Can be fully tested by running `python train.py` and verifying `model.pkl` is saved.

### Implementation for User Story 2

- [ ] T010 [P] [US2] Create `ML_Train/train.py` script skeleton
- [ ] T011 [US2] Implement CSV data loading and parsing using Pandas in `train.py`
- [ ] T012 [US2] Implement data preprocessing (Categorical encoding and scaling) for Breed, Gender, Age, and Weight
- [ ] T013 [US2] Train the `DecisionTreeClassifier` model on the processed dataset
- [ ] T014 [US2] Serialize and export the complete pipeline (preprocessing + model) to `ML_Train/model.pkl`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently and integrate end-to-end.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T015 Code cleanup and ensuring PEP8 standards across Python scripts
- [ ] T016 Run end-to-end `quickstart.md` validation (train model -> start server -> test endpoint)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all user stories being complete

### Parallel Opportunities

- Pydantic models (T005) can be developed independently of the FastAPI routing (T004).
- The `train.py` pipeline (T010-T014) can be developed in parallel with the `/predict` endpoint routing (T006).

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Phase 1 and 2.
2. Complete Phase 3 (US1).
3. Validate API handles prediction requests properly.

### Incremental Delivery
1. Start with the API (US1).
2. Add the dynamic training script (US2).
3. Connect them so that `train.py` produces the model that `main.py` consumes.
