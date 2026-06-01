export interface Product {
  id: number
  name: string
  sku: string
  price: number
  quantity: number
  description?: string
  category?: string
  image_url?: string
  created_at: string
  updated_at: string
}

export interface Customer {
  id: number
  full_name: string
  email: string
  phone?: string
  created_at: string
  total_orders?: number
}

export interface OrderItem {
  id: number
  product_id: number
  quantity: number
  price: number
  product?: Product
}

export interface Order {
  id: number
  customer_id: number
  total_amount: number
  status: 'pending' | 'completed' | 'cancelled'
  created_at: string
  customer?: Customer
  items: OrderItem[]
}

export interface DashboardStats {
  total_products: number
  total_customers: number
  total_orders: number
  total_revenue: number
  low_stock_products: LowStockProduct[]
  recent_orders: Order[]
}

export interface LowStockProduct {
  id: number
  name: string
  sku: string
  quantity: number
  category?: string
}

export interface ProductCreate {
  name: string
  sku: string
  price: number
  quantity: number
  description?: string
  category?: string
  image_url?: string
}

export interface CustomerCreate {
  full_name: string
  email: string
  phone?: string
}

export interface OrderItemCreate {
  product_id: number
  quantity: number
}

export interface OrderCreate {
  customer_id: number
  items: OrderItemCreate[]
  status?: string
}
