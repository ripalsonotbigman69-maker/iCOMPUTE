import os
import hashlib
import secrets
import smtplib
import ssl
from email.message import EmailMessage
from datetime import datetime, timedelta
from typing import Any, Generator
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import traceback
from sqlalchemy import inspect, text
from sqlalchemy.orm import Session
from database import engine, Base, SessionLocal
import models
import schemas
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

app = FastAPI()


@app.exception_handler(Exception)
def dev_exception_handler(request: Request, exc: Exception):
    tb = ''.join(traceback.format_exception(type(exc), exc, exc.__traceback__))
    return JSONResponse(status_code=500, content={
        'error': str(exc),
        'trace': tb,
    })

# Updated CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db() -> Generator[Session, None, None]:
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def normalize_transaction(tx: models.Transaction) -> dict[str, Any]:
    return {
        'id': tx.id,
        'kind': tx.kind,
        'amount': float(tx.amount),
        'category': tx.category,
        'description': tx.description,
        'date': tx.date.isoformat() if hasattr(tx.date, 'isoformat') else str(tx.date),
    }


def normalize_user(user: models.User) -> dict[str, Any]:
    return {
        'email': user.email,
        'firstName': user.first_name or '',
        'lastName': user.last_name or '',
        'monthlyBudget': float(user.monthly_budget or 0),
        'bankBalance': float(user.bank_balance or 0),
        'cashOnHand': float(user.cash_on_hand or 0),
        'creditCardBalance': float(user.credit_card_balance or 0),
        'debitCardBalance': float(user.debit_card_balance or 0),
        'pin': user.pin,
    }


def build_account_response(user: models.User, transactions: list[models.Transaction]) -> dict[str, Any]:
    return {
        'user': normalize_user(user),
        'transactions': [normalize_transaction(t) for t in transactions],
    }


def normalize_account(user: models.User) -> dict[str, Any]:
    return {
        'email': user.email,
        'firstName': user.first_name or '',
        'lastName': user.last_name or '',
        'monthlyBudget': float(user.monthly_budget or 0),
        'bankBalance': float(user.bank_balance or 0),
        'cashOnHand': float(user.cash_on_hand or 0),
        'creditCardBalance': float(user.credit_card_balance or 0),
        'debitCardBalance': float(user.debit_card_balance or 0),
        'pinSet': bool(user.pin),
    }


def get_transactions_for_email(db: Session, email: str) -> list[models.Transaction]:
    transactions = db.query(models.Transaction).filter_by(owner_email=email).order_by(models.Transaction.date.desc()).all()
    return transactions


def hash_password(password: str, salt: str) -> str:
    return hashlib.sha256(f'{salt}{password}'.encode('utf-8')).hexdigest()


def verify_password(password: str, salt: str, password_hash: str) -> bool:
    return hash_password(password, salt) == password_hash


def ensure_auth_columns() -> None:
    inspector: Any = inspect(engine)
    if not inspector.has_table('users'):
        return

    columns: set[str] = {column['name'] for column in inspector.get_columns('users')}
    statements: list[str] = []
    if 'pin' not in columns:
        statements.append('ALTER TABLE users ADD COLUMN pin VARCHAR(20)')
    if 'bank_balance' not in columns:
        statements.append('ALTER TABLE users ADD COLUMN bank_balance FLOAT DEFAULT 0.0')
    if 'cash_on_hand' not in columns:
        statements.append('ALTER TABLE users ADD COLUMN cash_on_hand FLOAT DEFAULT 0.0')
    if 'credit_card_balance' not in columns:
        statements.append('ALTER TABLE users ADD COLUMN credit_card_balance FLOAT DEFAULT 0.0')
    if 'debit_card_balance' not in columns:
        statements.append('ALTER TABLE users ADD COLUMN debit_card_balance FLOAT DEFAULT 0.0')
    if 'password_hash' not in columns:
        statements.append('ALTER TABLE users ADD COLUMN password_hash VARCHAR(255)')
    if 'password_salt' not in columns:
        statements.append('ALTER TABLE users ADD COLUMN password_salt VARCHAR(64)')
    if 'password_reset_token' not in columns:
        statements.append('ALTER TABLE users ADD COLUMN password_reset_token VARCHAR(255)')
    if 'password_reset_expires_at' not in columns:
        statements.append('ALTER TABLE users ADD COLUMN password_reset_expires_at DATETIME')

    if statements:
        with engine.begin() as connection:
            for statement in statements:
                connection.execute(text(statement))


def ensure_transactions_id_sequence() -> None:
    inspector: Any = inspect(engine)
    if not inspector.has_table('transactions'):
        return

    columns = inspector.get_columns('transactions')
    id_col = next((column for column in columns if column['name'] == 'id'), None)
    created_at_col = next((column for column in columns if column['name'] == 'created_at'), None)
    id_default = id_col.get('default') if id_col else None
    created_at_default = created_at_col.get('default') if created_at_col else None

    if id_default is None or created_at_default is None:
        with engine.begin() as connection:
            if id_default is None:
                connection.execute(text('CREATE SEQUENCE IF NOT EXISTS transactions_id_seq;'))
                connection.execute(text(
                    "ALTER TABLE transactions ALTER COLUMN id SET DEFAULT nextval('transactions_id_seq');"
                ))
                connection.execute(text(
                    "SELECT setval('transactions_id_seq', COALESCE((SELECT MAX(id) FROM transactions), 0) + 1, false);"
                ))
            if created_at_default is None:
                connection.execute(text(
                    "ALTER TABLE transactions ALTER COLUMN created_at SET DEFAULT now();"
                ))


def password_is_strong(password: str) -> bool:
    if not password or len(password) < 8 or len(password) > 12:
        return False
    has_upper = any(c.isupper() for c in password)
    has_lower = any(c.islower() for c in password)
    has_digit = any(c.isdigit() for c in password)
    has_symbol = any(not c.isalnum() for c in password)
    return has_upper and has_lower and has_digit and has_symbol


@app.on_event('startup')
def startup():
    Base.metadata.create_all(bind=engine)
    ensure_auth_columns()
    ensure_transactions_id_sequence()


@app.get('/api/bootstrap', response_model=schemas.BootstrapResponse)
def bootstrap(email: str = 'icompute@gmail.com', db: Session = Depends(get_db)):
    user = db.query(models.User).filter_by(email=email).first()
    if not user:
        raise HTTPException(status_code=404, detail='User not found')

    transactions = get_transactions_for_email(db, email)
    return build_account_response(user, transactions)


@app.post('/api/auth/signup', response_model=schemas.UserSchema, status_code=201)
def signup(payload: schemas.AuthSignupRequest, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()
    password = payload.password.strip()
    if not email or '@' not in email:
        raise HTTPException(status_code=422, detail='Valid email is required')
    if not password_is_strong(password):
        raise HTTPException(status_code=422, detail='Password must be 8–12 chars and include uppercase, lowercase, number, and symbol')

    existing_user = db.query(models.User).filter_by(email=email).first()
    if existing_user:
        raise HTTPException(status_code=409, detail='Account already exists')

    salt = secrets.token_hex(16)
    user = models.User(
        email=email,
        first_name=(payload.first_name or '').strip(),
        last_name=(payload.last_name or '').strip(),
        monthly_budget=23000,
        pin=None,
        password_salt=salt,
        password_hash=hash_password(password, salt),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return normalize_user(user)


@app.post('/api/auth/login', response_model=schemas.AuthResponse)
def login(payload: schemas.AuthLoginRequest, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()
    password = payload.password.strip()
    if not email or '@' not in email:
        raise HTTPException(status_code=422, detail='Valid email is required')
    if not password:
        raise HTTPException(status_code=422, detail='Password is required')

    user = db.query(models.User).filter_by(email=email).first()
    if not user or not user.password_hash or not user.password_salt:
        raise HTTPException(status_code=401, detail='Invalid email or password')
    if not verify_password(password, user.password_salt, user.password_hash):
        raise HTTPException(status_code=401, detail='Invalid email or password')

    transactions = get_transactions_for_email(db, email)
    return build_account_response(user, transactions)


@app.post('/api/auth/forgot-password')
def forgot_password(payload: schemas.AuthForgotPasswordRequest, db: Session = Depends(get_db)) -> dict[str, str]:
    email = payload.email.strip().lower()
    if not email or '@' not in email:
        raise HTTPException(status_code=422, detail='Valid email is required')

    user = db.query(models.User).filter_by(email=email).first()
    if not user:
        raise HTTPException(status_code=404, detail='User not found')

    token = secrets.token_urlsafe(16)
    expires_at = datetime.utcnow() + timedelta(minutes=15)
    user.password_reset_token = token
    user.password_reset_expires_at = expires_at
    db.commit()

    return {'message': 'Password reset email sent'}


@app.post('/api/auth/reset-password')
def reset_password(payload: schemas.AuthResetPasswordRequest, db: Session = Depends(get_db)) -> dict[str, bool]:
    email = payload.email.strip().lower()
    token = payload.token.strip()
    password = payload.password.strip()
    if not email or '@' not in email:
        raise HTTPException(status_code=422, detail='Valid email is required')
    if not token:
        raise HTTPException(status_code=422, detail='Reset token is required')
    if not password_is_strong(password):
        raise HTTPException(status_code=422, detail='Password must be 8–12 chars and include uppercase, lowercase, number, and symbol')

    user = db.query(models.User).filter_by(email=email).first()
    if not user or not user.password_reset_token or not user.password_reset_expires_at:
        raise HTTPException(status_code=401, detail='Invalid reset request')
    if user.password_reset_token != token:
        raise HTTPException(status_code=401, detail='Invalid reset token')
    if datetime.utcnow() > user.password_reset_expires_at:
        raise HTTPException(status_code=401, detail='Reset token has expired')

    salt = secrets.token_hex(16)
    user.password_salt = salt
    user.password_hash = hash_password(password, salt)
    user.password_reset_token = None
    user.password_reset_expires_at = None
    db.commit()

    return {'success': True}


@app.post('/api/auth/pin/verify', response_model=schemas.PinVerifyResponse)
def verify_pin(payload: schemas.PinVerifyRequest, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()
    pin = payload.pin.strip()
    if not email or '@' not in email:
        raise HTTPException(status_code=422, detail='Valid email is required')
    if len(pin) != 4 or not pin.isdigit():
        raise HTTPException(status_code=422, detail='PIN must be 4 digits')

    user = db.query(models.User).filter_by(email=email).first()
    if not user or not user.pin:
        raise HTTPException(status_code=401, detail='PIN not set')

    return {'valid': user.pin == pin}


@app.get('/api/accounts', response_model=schemas.AccountsResponse)
def list_accounts(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return {'accounts': [normalize_account(user) for user in users]}


@app.put('/api/profile', response_model=schemas.UserSchema)
def update_profile(payload: schemas.UserSchema, db: Session = Depends(get_db)):
    email = payload.email
    if not email:
        raise HTTPException(status_code=422, detail='Email is required')

    user = db.query(models.User).filter_by(email=email).first()
    if not user:
        user = models.User(email=email)
        db.add(user)

    user.first_name = payload.first_name or ''
    user.last_name = payload.last_name or ''
    user.monthly_budget = float(payload.monthly_budget or 0)
    user.bank_balance = float(payload.bank_balance or 0)
    user.cash_on_hand = float(payload.cash_on_hand or 0)
    user.credit_card_balance = float(payload.credit_card_balance or 0)
    user.debit_card_balance = float(payload.debit_card_balance or 0)
    if getattr(payload, 'pin', None):
        user.pin = payload.pin
    db.commit()
    return {
        'email': user.email,
        'firstName': user.first_name or '',
        'lastName': user.last_name or '',
        'monthlyBudget': float(user.monthly_budget or 0),
    }


@app.post('/api/transactions', status_code=201, response_model=schemas.TransactionOut)
def create_transaction(payload: schemas.TransactionCreate, db: Session = Depends(get_db)):
    owner = payload.owner_email
    if not owner:
        raise HTTPException(status_code=422, detail='ownerEmail is required')

  
    try:
        if payload.date:
            date_val = datetime.fromisoformat(payload.date.replace('Z', '+00:00'))
        else:
            date_val = datetime.utcnow()
    except Exception:
        date_val = datetime.utcnow()

    tx = models.Transaction(
        owner_email=owner,
        kind=payload.kind,
        amount=float(payload.amount),
        category=payload.category or 'others',
        description=payload.description or '',
        date=date_val,
    )

    db.add(tx)
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
        
    db.refresh(tx)
    return normalize_transaction(tx)


@app.get('/internal/db-check')
def db_check(db: Session = Depends(get_db)):
    try:
        # simple check to count users and ensure DB queries succeed
        count = db.query(models.User).count()
        return {'ok': True, 'user_count': count}
    except Exception as e:
        return JSONResponse(status_code=500, content={'ok': False, 'error': str(e)})