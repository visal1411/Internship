# Implementation Plan: ML Train Service

**Branch**: `[001-ml-train-service]` | **Date**: 2026-08-30 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-ml-train-service/spec.md`

## Summary

Build a Python service using FastAPI and scikit-learn that trains a classification model on `cattle_dataset.csv` and exposes a `/predict` HTTP POST endpoint for the Node.js backend to evaluate cow health.

## User Review Required
> [!IMPORTANT]
> The selected port for the Python ML service is `5000`. Does this conflict with anything on your machine, or is this okay?

## Technical Context

**Language/Version**: Python 3.10+
**Primary Dependencies**: FastAPI, uvicorn, scikit-learn, pandas
**Storage**: Local file system (for `.pkl` model artifact)
**Testing**: pytest (if requested later)
**Target Platform**: Local server / Containerized
**Project Type**: ML Web Service
**Performance Goals**: <150ms prediction latency
**Constraints**: Must run alongside Node.js backend.
**Scale/Scope**: Single node ML API

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Full-Stack Separation**: Passed. Python ML service is fully decoupled from Node.js via REST API.
- **AI/ML Graceful Degradation**: Passed. Handled by backend, Python service can gracefully fail or be unavailable.
- **Type Safety & Validation**: Passed. FastAPI uses Pydantic to strictly validate the `/predict` input types.
- **IoT Data Integrity**: Passed. ML service only reads data, does not mutate existing data.

## Project Structure

### Documentation (this feature)

```text
specs/001-ml-train-service/
├── plan.md              # This file
├── research.md          # Technical decisions (FastAPI, Scikit-Learn)
├── data-model.md        # Python Pydantic models
├── quickstart.md        # Commands to train/run the server
├── contracts/
│   └── api.md           # The HTTP JSON contract for /predict
└── tasks.md             # To be generated
```

### Source Code (repository root)

```text
ML_Train/
├── main.py              # FastAPI server and /predict endpoint
├── train.py             # Model training script
├── requirements.txt     # Python dependencies
└── cattle_dataset.csv   # The raw dataset
```

**Structure Decision**: The ML logic will reside in the `ML_Train/` directory as a standalone Python service to keep it completely decoupled from the Node.js `backend/` and `frontend/` folders.

## Verification Plan

### Automated Tests
- N/A for this exact planning step, but can be executed via `pytest` if test files are added.

### Manual Verification
- We will execute `python train.py` to verify the model artifact is generated.
- We will run `uvicorn main:app --port 5000` and use `curl` to verify the prediction endpoint responds with a 200 OK and the correct confidence format.
