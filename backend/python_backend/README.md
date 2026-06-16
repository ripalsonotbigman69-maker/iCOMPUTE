# Python backend (FastAPI) for iCOMPUTE mobile

This backend uses SQLite only and serves the app from a single FastAPI service.

## Run locally

```bash
cd backend/python_backend
pip install -r requirements.txt
uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

The app stores data in `backend/python_backend/icompute_local.db`.

## API endpoints

- `GET /api/bootstrap?email=...`
- `PUT /api/profile` (JSON body)
- `POST /api/transactions` (JSON body)
- `POST /api/auth/signup` (JSON body)
- `POST /api/auth/login` (JSON body)
- `POST /api/auth/pin/verify` (JSON body)

## Notes

- No MySQL server is required.
- No PHP backend is required.
- The backend is fully self-contained with SQLite.
