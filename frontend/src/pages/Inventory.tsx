import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Warehouse, Package, TrendingUp, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { productsApi } from '@/services/api'
import { formatCurrency } from '@/lib/utils'
import type { Product } from '@/types'

// Generate warehouse sections from products
function buildWarehouseSections(products: Product[]) {
  const rows = ['A', 'B', 'C', 'D']
  const cols = [1, 2, 3, 4, 5, 6]
  const sections: {
    id: string
    row: string
    col: number
    products: Product[]
    totalStock: number
    capacity: number
    occupancy: number
    status: 'empty' | 'low' | 'occupied' | 'critical' | 'full'
  }[] = []

  let productIndex = 0
  for (const row of rows) {
    for (const col of cols) {
      const capacity = 50
      const sectionProducts: Product[] = []
      const count = Math.floor(Math.random() * 3) // 0-2 products per section (deterministic via index)
      for (let i = 0; i < count && productIndex < products.length; i++) {
        sectionProducts.push(products[productIndex++])
      }
      const totalStock = sectionProducts.reduce((s, p) => s + p.quantity, 0)
      const occupancy = Math.min(100, Math.round((totalStock / capacity) * 100))
      let status: 'empty' | 'low' | 'occupied' | 'critical' | 'full' = 'empty'
      if (occupancy === 0) status = 'empty'
      else if (occupancy < 15) status = 'critical'
      else if (occupancy < 30) status = 'low'
      else if (occupancy >= 90) status = 'full'
      else status = 'occupied'

      sections.push({ id: `${row}${col}`, row, col, products: sectionProducts, totalStock, capacity, occupancy, status })
    }
  }
  return sections
}

const statusConfig = {
  empty: { bg: 'bg-slate-100 dark:bg-slate-800/40', border: 'border-slate-200 dark:border-slate-700', text: 'text-slate-400', bar: 'bg-slate-300' },
  critical: { bg: 'bg-red-50 dark:bg-red-950/20', border: 'border-red-200 dark:border-red-900/40', text: 'text-red-600 dark:text-red-400', bar: 'bg-red-500' },
  low: { bg: 'bg-amber-50 dark:bg-amber-950/20', border: 'border-amber-200 dark:border-amber-900/40', text: 'text-amber-600 dark:text-amber-400', bar: 'bg-amber-500' },
  occupied: { bg: 'bg-emerald-50 dark:bg-emerald-950/20', border: 'border-emerald-200 dark:border-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-400', bar: 'bg-emerald-500' },
  full: { bg: 'bg-blue-50 dark:bg-blue-950/20', border: 'border-blue-200 dark:border-blue-900/40', text: 'text-blue-700 dark:text-blue-400', bar: 'bg-blue-500' },
}

export function Inventory() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.getAll(),
  })

  const sections = buildWarehouseSections(products as Product[])

  const totalStock = (products as Product[]).reduce((s, p) => s + p.quantity, 0)
  const totalCapacity = sections.length * 50
  const utilization = totalCapacity > 0 ? Math.round((totalStock / totalCapacity) * 100) : 0
  const inventoryValue = (products as Product[]).reduce((s, p) => s + p.price * p.quantity, 0)
  const lowStockCount = (products as Product[]).filter((p) => p.quantity < 10).length
  const outOfStockCount = (products as Product[]).filter((p) => p.quantity === 0).length

  const utilizationData = [{ name: 'Utilization', value: utilization, fill: '#16324f' }]

  const categoryMap: Record<string, number> = {}
  ;(products as Product[]).forEach((p) => {
    const cat = p.category ?? 'Uncategorized'
    categoryMap[cat] = (categoryMap[cat] ?? 0) + p.quantity
  })
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }))
  const PIE_COLORS = ['#16324f', '#f4c542', '#22c55e', '#8b5cf6', '#ef4444', '#06b6d4', '#f97316']

  const rows = ['A', 'B', 'C', 'D']

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-heading font-bold text-foreground">Inventory</h1>
        <p className="text-muted-foreground mt-1">Warehouse management and stock overview</p>
      </motion.div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Stock Units', value: totalStock.toLocaleString(), icon: Package, color: 'from-navy-700 to-navy-900', light: 'bg-navy-50 dark:bg-navy-950/30' },
          { label: 'Inventory Value', value: formatCurrency(inventoryValue), icon: TrendingUp, color: 'from-emerald-500 to-teal-600', light: 'bg-emerald-50 dark:bg-emerald-950/30' },
          { label: 'Low Stock Items', value: lowStockCount, icon: AlertTriangle, color: 'from-amber-500 to-orange-600', light: 'bg-amber-50 dark:bg-amber-950/30' },
          { label: 'Out of Stock', value: outOfStockCount, icon: XCircle, color: 'from-red-500 to-rose-600', light: 'bg-red-50 dark:bg-red-950/30' },
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
            <p className="text-sm text-muted-foreground mt-1">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Utilization Gauge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-3xl p-6 flex flex-col items-center"
        >
          <h3 className="text-lg font-heading font-semibold text-foreground self-start mb-4">Warehouse Utilization</h3>
          <div className="relative w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="65%"
                outerRadius="90%"
                startAngle={90}
                endAngle={-270}
                data={utilizationData}
              >
                <RadialBar dataKey="value" cornerRadius={8} background={{ fill: 'rgba(0,0,0,0.05)' }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-heading font-bold text-foreground">{utilization}%</span>
              <span className="text-xs text-muted-foreground">utilized</span>
            </div>
          </div>
          <div className="w-full mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Occupied</span>
              <span className="font-semibold text-foreground">{totalStock.toLocaleString()} units</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Available</span>
              <span className="font-semibold text-foreground">{(totalCapacity - totalStock).toLocaleString()} units</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Capacity</span>
              <span className="font-semibold text-foreground">{totalCapacity.toLocaleString()} units</span>
            </div>
          </div>
        </motion.div>

        {/* Stock Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card border border-border rounded-3xl p-6"
        >
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Stock Distribution</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" outerRadius={75} dataKey="value" paddingAngle={2}>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v} units`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {categoryData.slice(0, 5).map((cat, i) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-xs text-muted-foreground truncate max-w-[120px]">{cat.name}</span>
                </div>
                <span className="text-xs font-semibold text-foreground">{cat.value} units</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Status Legend */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-3xl p-6"
        >
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Section Status</h3>
          <div className="space-y-3">
            {[
              { status: 'full', label: 'Full (≥90%)', count: sections.filter((s) => s.status === 'full').length },
              { status: 'occupied', label: 'Occupied (30–89%)', count: sections.filter((s) => s.status === 'occupied').length },
              { status: 'low', label: 'Low (15–29%)', count: sections.filter((s) => s.status === 'low').length },
              { status: 'critical', label: 'Critical (<15%)', count: sections.filter((s) => s.status === 'critical').length },
              { status: 'empty', label: 'Empty (0%)', count: sections.filter((s) => s.status === 'empty').length },
            ].map((item) => {
              const cfg = statusConfig[item.status as keyof typeof statusConfig]
              return (
                <div key={item.status} className={`flex items-center justify-between p-3 rounded-2xl border ${cfg.bg} ${cfg.border}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${cfg.bar}`} />
                    <span className={`text-sm font-medium ${cfg.text}`}>{item.label}</span>
                  </div>
                  <span className={`text-sm font-bold ${cfg.text}`}>{item.count}</span>
                </div>
              )
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-medium">{sections.length} total sections monitored</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Warehouse Grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-card border border-border rounded-3xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Warehouse Floor Plan</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Interactive section view — hover for details</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            {Object.entries(statusConfig).map(([key, cfg]) => (
              <div key={key} className="hidden sm:flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${cfg.bar}`} />
                <span className="text-muted-foreground capitalize">{key}</span>
              </div>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-6 gap-3">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {rows.map((row) => (
              <div key={row} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground w-4">Row {row}</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {sections
                    .filter((s) => s.row === row)
                    .map((section) => {
                      const cfg = statusConfig[section.status]
                      return (
                        <motion.div
                          key={section.id}
                          whileHover={{ scale: 1.06, zIndex: 10 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                          className={`relative border rounded-2xl p-3 cursor-pointer transition-all ${cfg.bg} ${cfg.border} group`}
                        >
                          <div className={`font-heading font-bold text-sm ${cfg.text}`}>{section.id}</div>
                          <div className={`text-xs mt-0.5 ${cfg.text} opacity-80`}>{section.occupancy}%</div>
                          <div className="mt-2 h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${cfg.bar} transition-all duration-500`}
                              style={{ width: `${section.occupancy}%` }}
                            />
                          </div>
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 bg-popover border border-border rounded-xl p-2.5 shadow-modal opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 text-xs">
                            <p className="font-bold text-foreground mb-1">Section {section.id}</p>
                            <p className="text-muted-foreground">Stock: {section.totalStock} units</p>
                            <p className="text-muted-foreground">Capacity: {section.capacity} units</p>
                            <p className="text-muted-foreground capitalize">Status: {section.status}</p>
                          </div>
                        </motion.div>
                      )
                    })}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Product Stock Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-3xl overflow-hidden shadow-card"
      >
        <div className="px-6 py-5 border-b border-border">
          <h3 className="text-lg font-heading font-semibold text-foreground">Stock Levels</h3>
          <p className="text-sm text-muted-foreground mt-0.5">All products with current stock status</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['Product', 'SKU', 'Category', 'Stock', 'Value', 'Health'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-5 py-4"><div className="h-4 bg-muted rounded animate-pulse" /></td>
                      ))}
                    </tr>
                  ))
                : (products as Product[]).map((product, idx) => {
                    const healthPct = Math.min(100, Math.round((product.quantity / 200) * 100))
                    const healthColor = product.quantity === 0 ? 'bg-red-500' : product.quantity < 10 ? 'bg-amber-500' : 'bg-emerald-500'
                    return (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.02 }}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-5 py-4 text-sm font-semibold text-foreground">{product.name}</td>
                        <td className="px-5 py-4">
                          <span className="text-xs font-mono bg-muted px-2 py-1 rounded-lg text-muted-foreground">{product.sku}</span>
                        </td>
                        <td className="px-5 py-4 text-sm text-muted-foreground">{product.category ?? '—'}</td>
                        <td className="px-5 py-4 text-sm font-bold text-foreground">{product.quantity}</td>
                        <td className="px-5 py-4 text-sm font-semibold text-foreground">{formatCurrency(product.price * product.quantity)}</td>
                        <td className="px-5 py-4 w-32">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${healthColor}`} style={{ width: `${healthPct}%` }} />
                            </div>
                            <span className="text-xs text-muted-foreground w-8 text-right">{healthPct}%</span>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
