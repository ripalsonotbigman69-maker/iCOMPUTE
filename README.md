# iCOMPUTE Mobile

Frontend: React (Vite), Tailwind CSS, Shadcn UI.

Backend: Python FastAPI.

Database: SQLite.

## Backend setup
Open Terminal and Run.
1. Backend (FastAPI) Navigate to the backend directory.
Bash: cd backend/python_backend

2. Create and activate your virtual environment.
Bash: python -m venv .venv
.venv\Scripts\activate

3. Install dependencies.
Bash: pip install -r requirements.txt

4. Start the API.
Bash: uvicorn app:app --reload --port 8000

## Frontend (React)
Open a new terminal tab in the project root directory.

1. Install dependencies.
Bash: npm install

2. Start the development server.
Bash: npm run dev

3. Access the app at: http://localhost:8080


#must keep the backend open 
vercel --prod 

git add .
git commit -m "changes"
git push
