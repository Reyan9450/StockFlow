from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List
from datetime import datetime


# ─── Product Schemas ──────────────────────────────────────────────────────────

class ProductBase(BaseModel):
    name: str
    sku: str
    price: float
    quantity: int
    description: Optional[str] = None
    category: Optional[str] = None
    image_url: Optional[str] = None

    @field_validator("price")
    @classmethod
    def price_must_be_positive(cls, v):
        if v < 0:
            raise ValueError("Price cannot be negative")
        return v

    @field_validator("quantity")
    @classmethod
    def quantity_must_be_non_negative(cls, v):
        if v < 0:
            raise ValueError("Quantity cannot be negative")
        return v


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = None
    description: Optional[str] = None
    category: Optional[str] = None
    image_url: Optional[str] = None

    @field_validator("price")
    @classmethod
    def price_must_be_positive(cls, v):
        if v is not None and v < 0:
            raise ValueError("Price cannot be negative")
        return v

    @field_validator("quantity")
    @classmethod
    def quantity_must_be_non_negative(cls, v):
        if v is not None and v < 0:
            raise ValueError("Quantity cannot be negative")
        return v


class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ─── Customer Schemas ─────────────────────────────────────────────────────────

class CustomerBase(BaseModel):
    full_name: str
    email: str
    phone: Optional[str] = None


class CustomerCreate(CustomerBase):
    pass


class CustomerResponse(CustomerBase):
    id: int
    created_at: datetime
    total_orders: Optional[int] = 0

    class Config:
        from_attributes = True


# ─── Order Schemas ────────────────────────────────────────────────────────────

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

    @field_validator("quantity")
    @classmethod
    def quantity_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("Quantity must be positive")
        return v


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: float
    product: Optional[ProductResponse] = None

    class Config:
        from_attributes = True


class OrderCreate(BaseModel):
    customer_id: int
    items: List[OrderItemCreate]
    status: Optional[str] = "pending"


class OrderResponse(BaseModel):
    id: int
    customer_id: int
    total_amount: float
    status: str
    created_at: datetime
    customer: Optional[CustomerResponse] = None
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True


# ─── Dashboard Schemas ────────────────────────────────────────────────────────

class LowStockProduct(BaseModel):
    id: int
    name: str
    sku: str
    quantity: int
    category: Optional[str] = None

    class Config:
        from_attributes = True


class DashboardStats(BaseModel):
    total_products: int
    total_customers: int
    total_orders: int
    total_revenue: float
    low_stock_products: List[LowStockProduct]
    recent_orders: List[OrderResponse] = []


# ─── Generic Response ─────────────────────────────────────────────────────────

class MessageResponse(BaseModel):
    message: str
