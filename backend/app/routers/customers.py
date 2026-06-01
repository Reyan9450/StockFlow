from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/customers", tags=["Customers"])


@router.post("/", response_model=schemas.CustomerResponse, status_code=201)
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Customer).filter(models.Customer.email == customer.email).first()
    if existing:
        raise HTTPException(status_code=409, detail=f"Customer with email '{customer.email}' already exists")

    db_customer = models.Customer(**customer.model_dump())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)

    total_orders = db.query(models.Order).filter(models.Order.customer_id == db_customer.id).count()
    result = schemas.CustomerResponse.model_validate(db_customer)
    result.total_orders = total_orders
    return result


@router.get("/", response_model=List[schemas.CustomerResponse])
def get_customers(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(models.Customer)
    if search:
        query = query.filter(
            models.Customer.full_name.ilike(f"%{search}%") |
            models.Customer.email.ilike(f"%{search}%")
        )
    customers = query.offset(skip).limit(limit).all()

    result = []
    for customer in customers:
        total_orders = db.query(models.Order).filter(models.Order.customer_id == customer.id).count()
        c = schemas.CustomerResponse.model_validate(customer)
        c.total_orders = total_orders
        result.append(c)
    return result


@router.get("/{customer_id}", response_model=schemas.CustomerResponse)
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(models.Customer).filter(models.Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    total_orders = db.query(models.Order).filter(models.Order.customer_id == customer.id).count()
    result = schemas.CustomerResponse.model_validate(customer)
    result.total_orders = total_orders
    return result


@router.delete("/{customer_id}", response_model=schemas.MessageResponse)
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(models.Customer).filter(models.Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    db.delete(customer)
    db.commit()
    return {"message": f"Customer '{customer.full_name}' deleted successfully"}
