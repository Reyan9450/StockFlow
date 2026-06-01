import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Package, ShoppingCart, BarChart2 } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { dashboardApi } from '@/services/api'
import { formatCurrency } from '@/lib/utils'

// ── Static chart data ──────────────────────────────────────────────────────────
const revenueData = [
  { month: 'Jan', revenue: 12400, prev: 9800 },
  { month: 'Feb', revenue: 18200, prev: 14100 },
  { month: 'Mar', revenue: 15800, prev: 13200 },
  { month: 'Apr', revenue: 22100, prev: 17600 },
  { month: 'May', revenue: 19600, prev: 16400 },
  { month: 'Jun', revenue: 28400, prev: 21000 },
  { month: 'Jul', revenue: 24800, prev: 20100 },
  { month: 'Aug', revenue: 31200, prev: 24800 },
  { month: 'Sep', revenue: 27600, prev: 22300 },
  { month: 'Oct', revenue: 35400, prev: 28100 },
  { month: 'Nov', revenue: 32100, prev: 26400 },
  { month: 'Dec', revenue: 41800, prev: 33200 },
]

const ordersData = [
  { month: 'Jan', orders: 45, returns: 3 },
  { month: 'Feb', orders: 62, returns: 5 },
  { month: 'Mar', orders: 54, returns: 4 },
  { month: 'Apr', orders: 78, returns: 6 },
  { month: 'May', orders: 69, returns: 4 },
  { month: 'Jun', orders: 95, returns: 7 },
  { month: 'Jul', orders: 84, returns: 5 },
  { month: 'Aug', orders: 108, returns: 9 },
  { month: 'Sep', orders: 92, returns: 6 },
  { month: 'Oct', orders: 121, returns: 10 },
  { month: 'Nov', orders: 112, returns: 8 },
  { month: 'Dec', orders: 145, returns: 11 },
]

const customerGrowthData = [
  { month: 'Jan', customers: 24 },
  { month: 'Feb', customers: 31 },
  { month: 'Mar', customers: 28 },
  { month: 'Apr', customers: 42 },
  { month: 'May', customers: 38 },
  { month: 'Jun', customers: 55 },
  { month: 'Jul', customers: 48 },
  { month: 'Aug', customers: 67 },
  { month: 'Sep', customers: 59 },
  { month: 'Oct', customers: 78 },
  { month: 'Nov', customers: 71 },
  { month: 'Dec', customers: 94 },
]

const topProductsData = [
  { name: 'MacBook Pro', sales: 142, revenue: 354858 },
  { name: 'iPhone 15 Pro', sales: 218, revenue: 217782 },
  { name: 'Dell Monitor', sales: 96, revenue: 57599 },
  { name: 'Sony WH-1000', sales: 134, revenue: 46899 },
  { name: 'Ergonomic Chair', sales: 67, revenue: 30149 },
  { name: 'Standing Desk', sales: 41, revenue: 28699 },
]

const inventoryTurnoverData = [
  { category: 'Electronics', turnover: 4.2 },
  { category: 'Clothing', turnover: 6.8 },
  { category: 'Tools', turnover: 2.1 },
  { category: 'Food', turnover: 12.4 },
  { category: 'Office', turnover: 3.5 },
  { category: 'Sports', turnover: 5.1 },
]

const statusDistribution = [
  { name: 'Completed', value: 68, color: '#22c55e' },
  { name: 'Pending', value: 22, color: '#f59e0b' },
  { name: 'Cancelled', value: 10, color: '#ef4444' },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-2xl p-3 shadow-modal text-sm">
        <p className="font-semibold text-muted-foreground mb-1.5">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="font-bold" style={{ color: p.color }}>
            {p.name}: {typeof p.value === 'number' && p.name?.toLowerCase().includes('revenue') ? formatCurrency(p.value) : p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

function SectionCard({ title, subtitle, children, delay = 0 }: { title: string; subtitle?: string; children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-card border border-border rounded-3xl p-6 shadow-card"
    >
      <div className="mb-5">
        <h3 className="text-lg font-heading font-semibold text-foreground">{title}</h3>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  )
}

export function Analytics() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi.getStats,
  })

  const totalRevenue = revenueData.reduce((s, d) => s + d.revenue, 0)
  const totalOrders = ordersData.reduce((s, d) => s + d.orders, 0)
  const totalCustomers = customerGrowthData.reduce((s, d) => s + d.customers, 0)
  const avgOrderValue = totalRevenue / totalOrders

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-heading font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Business intelligence and performance metrics</p>
      </motion.div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Annual Revenue', value: formatCurrency(totalRevenue), icon: TrendingUp, trend: '+18.2%', color: 'from-navy-700 to-navy-900' },
          { label: 'Total Orders', value: totalOrders.toLocaleString(), icon: ShoppingCart, trend: '+23.4%', color: 'from-emerald-500 to-teal-600' },
          { label: 'New Customers', value: totalCustomers.toLocaleString(), icon: Users, trend: '+15.7%', color: 'from-violet-500 to-purple-600' },
          { label: 'Avg Order Value', value: formatCurrency(avgOrderValue), icon: BarChart2, trend: '+6.1%', color: 'from-golden-400 to-golden-600' },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -3 }}
            className="bg-card border border-border rounded-3xl p-5 shadow-card"
          >
            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${kpi.color} flex items-center justify-center mb-4`}>
              <kpi.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-heading font-bold text-foreground">{kpi.value}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{kpi.label}</p>
            <span className="inline-block mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">
              {kpi.trend} YoY
            </span>
          </motion.div>
        ))}
      </div>

      {/* Revenue Trend */}
      <SectionCard title="Revenue Trend" subtitle="Current year vs previous year comparison" delay={0.2}>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={revenueData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="revCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16324f" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#16324f" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="revPrev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f4c542" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#f4c542" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area type="monotone" dataKey="revenue" name="2024" stroke="#16324f" strokeWidth={2.5} fill="url(#revCurrent)" dot={false} />
            <Area type="monotone" dataKey="prev" name="2023" stroke="#f4c542" strokeWidth={2} fill="url(#revPrev)" dot={false} strokeDasharray="4 4" />
          </AreaChart>
        </ResponsiveContainer>
      </SectionCard>

      {/* Orders + Customer Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Orders Trend" subtitle="Monthly orders and returns" delay={0.25}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={ordersData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="orders" name="Orders" fill="#16324f" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="returns" name="Returns" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Customer Growth" subtitle="New customers acquired per month" delay={0.3}>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={customerGrowthData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="custGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="customers" name="Customers" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: '#8b5cf6', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Top Products + Order Status + Inventory Turnover */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <SectionCard title="Top Selling Products" subtitle="By units sold" delay={0.35} >
          <div className="space-y-3">
            {topProductsData.map((product, i) => (
              <div key={product.name} className="flex items-center gap-3">
                <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground truncate">{product.name}</span>
                    <span className="text-xs font-bold text-foreground ml-2">{product.sales}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(product.sales / topProductsData[0].sales) * 100}%` }}
                      transition={{ delay: 0.4 + i * 0.05, duration: 0.6 }}
                      className="h-full rounded-full bg-gradient-to-r from-navy-700 to-navy-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Order Status Distribution */}
        <SectionCard title="Order Status" subtitle="Distribution breakdown" delay={0.4}>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={statusDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {statusDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {statusDistribution.map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-sm text-muted-foreground">{s.name}</span>
                </div>
                <span className="text-sm font-bold text-foreground">{s.value}%</span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Inventory Turnover */}
        <SectionCard title="Inventory Turnover" subtitle="Turns per year by category" delay={0.45}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={inventoryTurnoverData} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={60} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="turnover" name="Turnover" fill="#f4c542" radius={[0, 4, 4, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>
    </div>
  )
}
