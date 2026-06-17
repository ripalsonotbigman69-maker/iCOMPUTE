import os
from typing import Generator, Any
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker

DATABASE_URL = os.environ.get('DATABASE_URL')

engine: Any = create_engine(DATABASE_URL, future=True)
SessionLocal: Any = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)
Base: Any = declarative_base()

def get_session() -> Generator[Session, None, None]:
    """Yield a SQLAlchemy session and ensure it's closed afterwards."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()