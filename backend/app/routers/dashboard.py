from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=schemas.DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_products = db.query(func.count(models.Product.id)).scalar() or 0
    total_customers = db.query(func.count(models.Customer.id)).scalar() or 0
    total_orders = db.query(func.count(models.Order.id)).scalar() or 0
    total_revenue = db.query(func.sum(models.Order.total_amount)).scalar() or 0.0

    low_stock = (
        db.query(models.Product)
        .filter(models.Product.quantity < 10)
        .order_by(models.Product.quantity.asc())
        .limit(10)
        .all()
    )

    recent_orders = (
        db.query(models.Order)
        .options(
            joinedload(models.Order.customer),
            joinedload(models.Order.items).joinedload(models.OrderItem.product),
        )
        .order_by(models.Order.created_at.desc())
        .limit(5)
        .all()
    )

    return {
        "total_products": total_products,
        "total_customers": total_customers,
        "total_orders": total_orders,
        "total_revenue": round(float(total_revenue), 2),
        "low_stock_products": low_stock,
        "recent_orders": recent_orders,
    }
