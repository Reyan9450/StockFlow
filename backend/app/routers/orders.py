from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/", response_model=schemas.OrderResponse, status_code=201)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    # Validate customer exists
    customer = db.query(models.Customer).filter(models.Customer.id == order.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    # Validate all products and stock
    total_amount = 0.0
    order_items_data = []

    for item in order.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product with id {item.product_id} not found")
        if product.quantity < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for '{product.name}'. Available: {product.quantity}, Requested: {item.quantity}"
            )
        order_items_data.append((product, item.quantity))
        total_amount += product.price * item.quantity

    # Create order
    db_order = models.Order(
        customer_id=order.customer_id,
        total_amount=round(total_amount, 2),
        status=order.status or "pending",
    )
    db.add(db_order)
    db.flush()

    # Create order items and reduce stock
    for product, quantity in order_items_data:
        order_item = models.OrderItem(
            order_id=db_order.id,
            product_id=product.id,
            quantity=quantity,
            price=product.price,
        )
        db.add(order_item)
        product.quantity -= quantity

    db.commit()
    db.refresh(db_order)

    # Reload with relationships
    db_order = (
        db.query(models.Order)
        .options(
            joinedload(models.Order.customer),
            joinedload(models.Order.items).joinedload(models.OrderItem.product),
        )
        .filter(models.Order.id == db_order.id)
        .first()
    )
    return db_order


@router.get("/", response_model=List[schemas.OrderResponse])
def get_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(models.Order).options(
        joinedload(models.Order.customer),
        joinedload(models.Order.items).joinedload(models.OrderItem.product),
    )
    if status:
        query = query.filter(models.Order.status == status)
    return query.order_by(models.Order.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/{order_id}", response_model=schemas.OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = (
        db.query(models.Order)
        .options(
            joinedload(models.Order.customer),
            joinedload(models.Order.items).joinedload(models.OrderItem.product),
        )
        .filter(models.Order.id == order_id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.delete("/{order_id}", response_model=schemas.MessageResponse)
def delete_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Restore stock
    for item in order.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if product:
            product.quantity += item.quantity

    db.delete(order)
    db.commit()
    return {"message": f"Order #{order_id} deleted successfully"}
