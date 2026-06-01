import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { dashboardApi } from '@/services/api'
import { StatCard } from '@/components/ui/StatCard'
import { Badge } from '@/components/ui/Badge'
import { StatCardSkeleton } from '@/components/ui/Skeleton'
import { formatCurrency, formatDate, getOrderStatusConfig } from '@/lib/utils'
import { Link } from 'react-router-dom'
import type { Order, LowStockProduct } from '@/types'

// Mock chart data
const revenueData = [
  { month: 'Jan', revenue: 12400, orders: 45 },
  { month: 'Feb', revenue: 18200, orders: 62 },
  { month: 'Mar', revenue: 15800, orders: 54 },
  { month: 'Apr', revenue: 22100, orders: 78 },
  { month: 'May', revenue: 19600, orders: 69 },
  { month: 'Jun', revenue: 28400, orders: 95 },
  { month: 'Jul', revenue: 24800, orders: 84 },
  { month: 'Aug', revenue: 31200, orders: 108 },
  { month: 'Sep', revenue: 27600, orders: 92 },
  { month: 'Oct', revenue: 35400, orders: 121 },
  { month: 'Nov', revenue: 32100, orders: 112 },
  { month: 'Dec', revenue: 41800, orders: 145 },
]

const orderBarData = [
  { day: 'Mon', orders: 12 },
  { day: 'Tue', orders: 19 },
  { day: 'Wed', orders: 15 },
  { day: 'Thu', orders: 24 },
  { day: 'Fri', orders: 31 },
  { day: 'Sat', orders: 18 },
  { day: 'Sun', orders: 9 },
]

const categoryData = [
  { name: 'Electronics', value: 35, color: '#16324f' },
  { name: 'Clothing', value: 25, color: '#f4c542' },
  { name: 'Tools', value: 15, color: '#22c55e' },
  { name: 'Food', value: 12, color: '#8b5cf6' },
  { name: 'Other', value: 13, color: '#94a3b8' },
]

const warehouseSections = [
  { id: 'A1', occupancy: 85, stock: 42, status: 'occupied' },
  { id: 'A2', occupancy: 60, stock: 30, status: 'occupied' },
  { id: 'A3', occupancy: 15, stock: 7, status: 'low' },
  { id: 'A4', occupancy: 0, stock: 0, status: 'empty' },
  { id: 'B1', occupancy: 92, stock: 46, status: 'occupied' },
  { id: 'B2', occupancy: 75, stock: 38, status: 'occupied' },
  { id: 'B3', occupancy: 45, stock: 22, status: 'occupied' },
  { id: 'B4', occupancy: 8, stock: 4, status: 'critical' },
  { id: 'C1', occupancy: 70, stock: 35, status: 'occupied' },
  { id: 'C2', occupancy: 55, stock: 28, status: 'occupied' },
  { id: 'C3', occupancy: 0, stock: 0, status: 'empty' },
  { id: 'C4', occupancy: 88, stock: 44, status: 'occupied' },
  { id: 'D1', occupancy: 30, stock: 15, status: 'low' },
  { id: 'D2', occupancy: 65, stock: 32, status: 'occupied' },
  { id: 'D3', occupancy: 5, stock: 2, status: 'critical' },
  { id: 'D4', occupancy: 78, stock: 39, status: 'occupied' },
]

const sectionColors: Record<string, string> = {
  occupied: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-700 dark:text-emerald-400',
  low: 'bg-amber-500/20 border-amber-500/40 text-amber-700 dark:text-amber-400',
  critical: 'bg-red-500/20 border-red-500/40 text-red-700 dark:text-red-400',
  empty: 'bg-slate-100 border-slate-200 text-slate-400 dark:bg-slate-800/40 dark:border-slate-700',
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-2xl p-3 shadow-modal">
        <p className="text-xs font-semibold text-muted-foreground mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-sm font-bold" style={{ color: p.color }}>
            {p.name === 'revenue' ? formatCurrency(p.value) : p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi.getStats,
  })

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back — here's what's happening with your inventory.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
            All systems operational
          </span>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Total Products"
              value={stats?.total_products ?? 0}
              trend={12}
              trendLabel="vs last month"
              icon={Package}
              gradient="bg-navy-800"
              iconBg="gradient-navy"
              delay={0}
            />
            <StatCard
              title="Total Customers"
              value={stats?.total_customers ?? 0}
              trend={8}
              trendLabel="vs last month"
              icon={Users}
              gradient="bg-violet-600"
              iconBg="bg-gradient-to-br from-violet-500 to-purple-600"
              delay={0.05}
            />
            <StatCard
              title="Total Orders"
              value={stats?.total_orders ?? 0}
              trend={23}
              trendLabel="vs last month"
              icon={ShoppingCart}
              gradient="bg-emerald-600"
              iconBg="bg-gradient-to-br from-emerald-500 to-teal-600"
              delay={0.1}
            />
            <StatCard
              title="Total Revenue"
              value={formatCurrency(stats?.total_revenue ?? 0)}
              trend={18}
              trendLabel="vs last month"
              icon={DollarSign}
              gradient="bg-golden-500"
              iconBg="bg-gradient-to-br from-golden-400 to-golden-600"
              delay={0.15}
            />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-2 bg-card border border-border rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-heading font-semibold text-foreground">Revenue Overview</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Monthly revenue trend for 2024</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
              <TrendingUp className="w-4 h-4" />
              +18.2% YoY
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16324f" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#16324f" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#16324f"
                strokeWidth={2.5}
                fill="url(#revenueGrad)"
                dot={false}
                activeDot={{ r: 5, fill: '#16324f' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card border border-border rounded-3xl p-6"
        >
          <div className="mb-4">
            <h3 className="text-lg font-heading font-semibold text-foreground">Stock by Category</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Inventory distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-xs text-muted-foreground">{cat.name}</span>
                </div>
                <span className="text-xs font-semibold text-foreground">{cat.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Orders Bar + Warehouse */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Weekly Orders Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-3xl p-6"
        >
          <div className="mb-6">
            <h3 className="text-lg font-heading font-semibold text-foreground">Weekly Orders</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Orders placed this week</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={orderBarData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="orders" fill="#f4c542" radius={[6, 6, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Warehouse Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="xl:col-span-2 bg-card border border-border rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-heading font-semibold text-foreground">Warehouse Overview</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Real-time section occupancy</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              {[
                { color: 'bg-emerald-500', label: 'Occupied' },
                { color: 'bg-amber-500', label: 'Low' },
                { color: 'bg-red-500', label: 'Critical' },
                { color: 'bg-slate-300', label: 'Empty' },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${l.color}`} />
                  <span className="text-muted-foreground">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2.5">
            {warehouseSections.map((section) => (
              <motion.div
                key={section.id}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className={`border rounded-2xl p-3 cursor-pointer transition-all ${sectionColors[section.status]}`}
              >
                <div className="font-heading font-bold text-sm">{section.id}</div>
                <div className="text-xs mt-1 opacity-80">{section.occupancy}%</div>
                <div className="mt-2 h-1 bg-black/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-current opacity-60"
                    style={{ width: `${section.occupancy}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row: Recent Orders + Low Stock */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="xl:col-span-2 bg-card border border-border rounded-3xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div>
              <h3 className="text-lg font-heading font-semibold text-foreground">Recent Orders</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Latest 5 orders</p>
            </div>
            <Link
              to="/orders"
              className="flex items-center gap-1.5 text-sm font-medium text-navy-700 dark:text-golden-400 hover:underline"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['Order ID', 'Customer', 'Items', 'Status', 'Amount', 'Date'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 bg-muted rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : stats?.recent_orders?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground text-sm">
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  stats?.recent_orders?.map((order: Order) => {
                    const statusCfg = getOrderStatusConfig(order.status)
                    return (
                      <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 text-sm font-mono font-semibold text-foreground">
                          #{String(order.id).padStart(4, '0')}
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">
                          {order.customer?.full_name ?? '—'}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? 's' : ''}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={
                              order.status === 'completed'
                                ? 'success'
                                : order.status === 'cancelled'
                                ? 'danger'
                                : 'warning'
                            }
                            dot
                          >
                            {statusCfg.label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-foreground">
                          {formatCurrency(order.total_amount)}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {formatDate(order.created_at)}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Low Stock Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-card border border-border rounded-3xl overflow-hidden"
        >
          <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h3 className="text-base font-heading font-semibold text-foreground">Low Stock Alert</h3>
              <p className="text-xs text-muted-foreground">Products below 10 units</p>
            </div>
          </div>
          <div className="p-4 space-y-2">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 bg-muted rounded-2xl animate-pulse" />
              ))
            ) : stats?.low_stock_products?.length === 0 ? (
              <div className="py-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mx-auto mb-3">
                  <Package className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-sm font-medium text-foreground">All stocked up!</p>
                <p className="text-xs text-muted-foreground mt-1">No low stock products</p>
              </div>
            ) : (
              stats?.low_stock_products?.map((product: LowStockProduct) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.sku}</p>
                  </div>
                  <div className="flex-shrink-0 ml-3">
                    <span className={`text-sm font-bold ${product.quantity === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                      {product.quantity}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">left</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
