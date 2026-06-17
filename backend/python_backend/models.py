from datetime import datetime
from typing import Optional, Any

from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey, Identity, func
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = 'users'
    email: Any = Column(String(255), primary_key=True, index=True)
    first_name: Any = Column(String(255), nullable=True)
    last_name: Any = Column(String(255), nullable=True)
    monthly_budget: Any = Column(Float, nullable=True, default=0.0)
    bank_balance: Any = Column(Float, nullable=True, default=0.0)
    cash_on_hand: Any = Column(Float, nullable=True, default=0.0)
    credit_card_balance: Any = Column(Float, nullable=True, default=0.0)
    debit_card_balance: Any = Column(Float, nullable=True, default=0.0)
    pin: Any = Column(String(20), nullable=True)
    password_hash: Any = Column(String(255), nullable=True)
    password_salt: Any = Column(String(64), nullable=True)
    password_reset_token: Any = Column(String(255), nullable=True)
    password_reset_expires_at: Any = Column(DateTime(timezone=True), nullable=True)

    def __init__(
        self,
        email: str,
        first_name: Optional[str] = None,
        last_name: Optional[str] = None,
        monthly_budget: float = 0.0,
        bank_balance: float = 0.0,
        cash_on_hand: float = 0.0,
        credit_card_balance: float = 0.0,
        debit_card_balance: float = 0.0,
        pin: Optional[str] = None,
        password_hash: Optional[str] = None,
        password_salt: Optional[str] = None,
        password_reset_token: Optional[str] = None,
        password_reset_expires_at: Optional[datetime] = None,
    ):
        self.email = email
        self.first_name = first_name
        self.last_name = last_name
        self.monthly_budget = monthly_budget
        self.bank_balance = bank_balance
        self.cash_on_hand = cash_on_hand
        self.credit_card_balance = credit_card_balance
        self.debit_card_balance = debit_card_balance
        self.pin = pin
        self.password_hash = password_hash
        self.password_salt = password_salt
        self.password_reset_token = password_reset_token
        self.password_reset_expires_at = password_reset_expires_at


class Transaction(Base):
    __tablename__ = 'transactions'
    id: Any = Column(Integer, Identity(start=1, cycle=False), primary_key=True)
    owner_email: Any = Column(String(255), ForeignKey('users.email'))
    kind: Any = Column(String(50), nullable=False)
    amount: Any = Column(Float, nullable=False)
    category: Any = Column(String(100), nullable=True)
    description: Any = Column(String(500), nullable=True)
    date: Any = Column(DateTime(timezone=True), nullable=False)
    created_at: Any = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    owner: Any = relationship('User')

    def __init__(
        self,
        owner_email: str,
        kind: str,
        amount: float,
        category: str = 'others',
        description: str = '',
        date: datetime | None = None,
    ):
        self.owner_email = owner_email
        self.kind = kind
        self.amount = amount
        self.category = category
        self.description = description
        self.date = date
