"""
Seed script to populate the database with sample data.
Run: python -m app.seed
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, engine, Base
from app import models
from datetime import datetime, timedelta
import random

Base.metadata.create_all(bind=engine)

CATEGORIES = ["Electronics", "Clothing", "Food & Beverage", "Tools", "Office Supplies", "Sports", "Home & Garden"]

PRODUCTS = [
    {"name": "MacBook Pro 16\"", "sku": "ELEC-001", "price": 2499.99, "quantity": 45, "category": "Electronics", "description": "Apple MacBook Pro with M3 chip"},
    {"name": "iPhone 15 Pro", "sku": "ELEC-002", "price": 999.99, "quantity": 120, "category": "Electronics", "description": "Latest iPhone with titanium design"},
    {"name": "Sony WH-1000XM5", "sku": "ELEC-003", "price": 349.99, "quantity": 8, "category": "Electronics", "description": "Premium noise-cancelling headphones"},
    {"name": "Dell UltraSharp 27\"", "sku": "ELEC-004", "price": 599.99, "quantity": 32, "category": "Electronics", "description": "4K USB-C monitor"},
    {"name": "Logitech MX Master 3", "sku": "ELEC-005", "price": 99.99, "quantity": 75, "category": "Electronics", "description": "Advanced wireless mouse"},
    {"name": "Nike Air Max 270", "sku": "CLTH-001", "price": 149.99, "quantity": 200, "category": "Clothing", "description": "Comfortable running shoes"},
    {"name": "Levi's 501 Jeans", "sku": "CLTH-002", "price": 79.99, "quantity": 150, "category": "Clothing", "description": "Classic straight fit jeans"},
    {"name": "Patagonia Fleece Jacket", "sku": "CLTH-003", "price": 199.99, "quantity": 5, "category": "Clothing", "description": "Sustainable outdoor jacket"},
    {"name": "Organic Coffee Beans 1kg", "sku": "FOOD-001", "price": 24.99, "quantity": 300, "category": "Food & Beverage", "description": "Single origin Ethiopian coffee"},
    {"name": "Green Tea Premium", "sku": "FOOD-002", "price": 18.99, "quantity": 7, "category": "Food & Beverage", "description": "Japanese matcha green tea"},
    {"name": "DeWalt Drill Set", "sku": "TOOL-001", "price": 189.99, "quantity": 40, "category": "Tools", "description": "20V cordless drill combo kit"},
    {"name": "Stanley Toolbox", "sku": "TOOL-002", "price": 89.99, "quantity": 25, "category": "Tools", "description": "Professional 3-drawer toolbox"},
    {"name": "Ergonomic Office Chair", "sku": "OFFC-001", "price": 449.99, "quantity": 18, "category": "Office Supplies", "description": "Lumbar support mesh chair"},
    {"name": "Standing Desk 60\"", "sku": "OFFC-002", "price": 699.99, "quantity": 3, "category": "Office Supplies", "description": "Electric height-adjustable desk"},
    {"name": "Yoga Mat Premium", "sku": "SPRT-001", "price": 79.99, "quantity": 90, "category": "Sports", "description": "Non-slip 6mm thick yoga mat"},
    {"name": "Resistance Bands Set", "sku": "SPRT-002", "price": 34.99, "quantity": 6, "category": "Sports", "description": "5-piece resistance band set"},
    {"name": "Garden Hose 50ft", "sku": "HOME-001", "price": 49.99, "quantity": 60, "category": "Home & Garden", "description": "Expandable flexible garden hose"},
    {"name": "Smart Thermostat", "sku": "HOME-002", "price": 249.99, "quantity": 22, "category": "Home & Garden", "description": "WiFi-enabled smart thermostat"},
    {"name": "USB-C Hub 7-in-1", "sku": "ELEC-006", "price": 59.99, "quantity": 85, "category": "Electronics", "description": "Multi-port USB-C hub"},
    {"name": "Mechanical Keyboard", "sku": "ELEC-007", "price": 129.99, "quantity": 9, "category": "Electronics", "description": "TKL mechanical gaming keyboard"},
]

CUSTOMERS = [
    {"full_name": "Alex Johnson", "email": "alex.johnson@techcorp.com", "phone": "+1-555-0101"},
    {"full_name": "Sarah Williams", "email": "sarah.w@designstudio.io", "phone": "+1-555-0102"},
    {"full_name": "Michael Chen", "email": "m.chen@startupventures.co", "phone": "+1-555-0103"},
    {"full_name": "Emily Rodriguez", "email": "emily.r@cloudservices.net", "phone": "+1-555-0104"},
    {"full_name": "David Kim", "email": "david.kim@innovatelab.com", "phone": "+1-555-0105"},
    {"full_name": "Jessica Taylor", "email": "j.taylor@mediagroup.org", "phone": "+1-555-0106"},
    {"full_name": "Ryan Martinez", "email": "ryan.m@devagency.dev", "phone": "+1-555-0107"},
    {"full_name": "Amanda Foster", "email": "a.foster@retailchain.com", "phone": "+1-555-0108"},
    {"full_name": "Chris Anderson", "email": "c.anderson@logistics.co", "phone": "+1-555-0109"},
    {"full_name": "Natalie Brown", "email": "n.brown@fintech.io", "phone": "+1-555-0110"},
    {"full_name": "James Wilson", "email": "j.wilson@healthcare.org", "phone": "+1-555-0111"},
    {"full_name": "Lisa Thompson", "email": "l.thompson@edutech.com", "phone": "+1-555-0112"},
]

STATUSES = ["pending", "completed", "cancelled", "pending", "completed", "completed"]


def seed():
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(models.Product).count() > 0:
            print("Database already seeded. Skipping.")
            return

        print("Seeding products...")
        products = []
        for p in PRODUCTS:
            product = models.Product(**p)
            db.add(product)
            products.append(product)
        db.flush()

        print("Seeding customers...")
        customers = []
        for c in CUSTOMERS:
            customer = models.Customer(**c)
            db.add(customer)
            customers.append(customer)
        db.flush()

        print("Seeding orders...")
        for i in range(30):
            customer = random.choice(customers)
            status = random.choice(STATUSES)
            days_ago = random.randint(0, 60)
            created_at = datetime.utcnow() - timedelta(days=days_ago)

            # Pick 1-3 random products
            selected_products = random.sample(products, random.randint(1, 3))
            total = 0.0
            order_items = []

            for product in selected_products:
                qty = random.randint(1, 5)
                total += product.price * qty
                order_items.append((product, qty))

            order = models.Order(
                customer_id=customer.id,
                total_amount=round(total, 2),
                status=status,
                created_at=created_at,
            )
            db.add(order)
            db.flush()

            for product, qty in order_items:
                item = models.OrderItem(
                    order_id=order.id,
                    product_id=product.id,
                    quantity=qty,
                    price=product.price,
                )
                db.add(item)

        db.commit()
        print("✅ Database seeded successfully!")

    except Exception as e:
        db.rollback()
        print(f"❌ Seeding failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
