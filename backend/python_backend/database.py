from typing import Generator, Any

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker

DATABASE_URL = 'sqlite:///./icompute_local.db'
connect_args: dict[str, Any] = {'check_same_thread': False}

engine: Any = create_engine(DATABASE_URL, future=True, connect_args=connect_args)
SessionLocal: Any = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)
Base: Any = declarative_base()


def get_session() -> Generator[Session, None, None]:
    """Yield a SQLAlchemy session and ensure it's closed afterwards.

    Returns a generator suitable for FastAPI `Depends(get_session)`.
    """
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
