from pydantic import BaseModel, Field
from typing import Optional


class UserSchema(BaseModel):
    email: str
    first_name: Optional[str] = Field('', alias='firstName')
    last_name: Optional[str] = Field('', alias='lastName')
    monthly_budget: Optional[float] = Field(0.0, alias='monthlyBudget')
    bank_balance: Optional[float] = Field(0.0, alias='bankBalance')
    cash_on_hand: Optional[float] = Field(0.0, alias='cashOnHand')
    credit_card_balance: Optional[float] = Field(0.0, alias='creditCardBalance')
    debit_card_balance: Optional[float] = Field(0.0, alias='debitCardBalance')
    pin: Optional[str] = Field(None, alias='pin')

    class Config:
        orm_mode = True
        allow_population_by_field_name = True
        allow_population_by_alias = True


class TransactionCreate(BaseModel):
    owner_email: str = Field(..., alias='ownerEmail')
    kind: str = Field('expense', alias='kind')
    amount: float = Field(..., alias='amount')
    category: Optional[str] = Field('others', alias='category')
    description: Optional[str] = Field('', alias='description')
    date: Optional[str] = Field(None, alias='date')

    class Config:
        allow_population_by_field_name = True
        allow_population_by_alias = True


class TransactionOut(BaseModel):
    id: int
    kind: str
    amount: float
    category: Optional[str]
    description: Optional[str]
    date: str

    class Config:
        orm_mode = True


class BootstrapResponse(BaseModel):
    user: UserSchema
    transactions: list[TransactionOut]

    class Config:
        orm_mode = True


class AuthSignupRequest(BaseModel):
    email: str
    password: str
    first_name: Optional[str] = Field('', alias='firstName')
    last_name: Optional[str] = Field('', alias='lastName')

    class Config:
        allow_population_by_field_name = True
        allow_population_by_alias = True


class AuthLoginRequest(BaseModel):
    email: str
    password: str


class AuthForgotPasswordRequest(BaseModel):
    email: str


class AuthResetPasswordRequest(BaseModel):
    email: str
    token: str
    password: str


class AuthResponse(BaseModel):
    user: UserSchema
    transactions: list[TransactionOut]

    class Config:
        orm_mode = True


class PinVerifyRequest(BaseModel):
    email: str
    pin: str


class PinVerifyResponse(BaseModel):
    valid: bool


class AccountSummary(BaseModel):
    email: str
    firstName: Optional[str] = Field('', alias='firstName')
    lastName: Optional[str] = Field('', alias='lastName')
    monthlyBudget: Optional[float] = Field(0.0, alias='monthlyBudget')
    bankBalance: Optional[float] = Field(0.0, alias='bankBalance')
    cashOnHand: Optional[float] = Field(0.0, alias='cashOnHand')
    creditCardBalance: Optional[float] = Field(0.0, alias='creditCardBalance')
    debitCardBalance: Optional[float] = Field(0.0, alias='debitCardBalance')
    pinSet: bool = Field(False, alias='pinSet')

    class Config:
        orm_mode = True
        allow_population_by_field_name = True
        allow_population_by_alias = True


class AccountsResponse(BaseModel):
    accounts: list[AccountSummary]
