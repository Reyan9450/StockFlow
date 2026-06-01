import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Search, Trash2, ShoppingCart, Filter, ChevronDown, ChevronUp, X } from 'lucide-react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ordersApi, customersApi, productsApi } from '@/services/api'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatDateTime, getOrderStatusConfig, getInitials, generateAvatarColor } from '@/lib/utils'
import type { Order, Customer, Product } from '@/types'

const orderSchema = z.object({
  customer_id: z.coerce.number().min(1, 'Select a customer'),
  status: z.string().default('pending'),
  items: z
    .array(
      z.object({
        product_id: z.coerce.number().min(1, 'Select a product'),
        quantity: z.coerce.number().int().min(1, 'Min 1'),
      })
    )
    .min(1, 'Add at least one item'),
})

type OrderFormData = z.infer<typeof orderSchema>

function OrderCard({ order, onDelete }: { order: Order; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const statusCfg = getOrderStatusConfig(order.status)
  const initials = order.customer ? getInitials(order.customer.full_name) : '?'
  const avatarGradient = order.customer ? generateAvatarColor(order.customer.full_name) : 'from-slate-400 to-slate-600'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          {/* Left */}
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
              {initials}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-muted-foreground">
                  #{String(order.id).padStart(4, '0')}
                </span>
                <Badge
                  variant={order.status === 'completed' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'}
                  dot
                >
                  {statusCfg.label}
                </Badge>
              </div>
              <p className="text-sm font-semibold text-foreground mt-0.5 truncate">
                {order.customer?.full_name ?? 'Unknown Customer'}
              </p>
              <p className="text-xs text-muted-foreground">{formatDateTime(order.created_at)}</p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-right">
              <p className="text-lg font-heading font-bold text-foreground">{formatCurrency(order.total_amount)}</p>
              <p className="text-xs text-muted-foreground">{order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? 's' : ''}</p>
            </div>
            <div className="flex flex-col gap-1">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setExpanded(!expanded)}
                className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
              >
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onDelete}
                className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 text-muted-foreground hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Expanded items */}
        {expanded && order.items && order.items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-border space-y-2"
          >
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                  <span className="text-foreground font-medium">{item.product?.name ?? `Product #${item.product_id}`}</span>
                  <span className="text-muted-foreground">× {item.quantity}</span>
                </div>
                <span className="font-semibold text-foreground">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-border text-sm font-bold">
              <span className="text-muted-foreground">Total</span>
              <span className="text-foreground">{formatCurrency(order.total_amount)}</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export function Orders() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<Order | null>(null)

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', statusFilter],
    queryFn: () => ordersApi.getAll({ status: statusFilter || undefined }),
  })

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: () => customersApi.getAll(),
  })

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.getAll(),
  })

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: { items: [{ product_id: 0, quantity: 1 }] },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  const watchedItems = watch('items')

  const calculateTotal = () => {
    return watchedItems.reduce((sum, item) => {
      const product = (products as Product[]).find((p) => p.id === Number(item.product_id))
      return sum + (product?.price ?? 0) * (item.quantity || 0)
    }, 0)
  }

  const createMutation = useMutation({
    mutationFn: ordersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Order created successfully')
      setModalOpen(false)
      reset({ items: [{ product_id: 0, quantity: 1 }] })
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: ordersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Order deleted')
      setDeleteConfirm(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const onSubmit = (data: OrderFormData) => {
    createMutation.mutate(data)
  }

  const filteredOrders = orders.filter((o: Order) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      String(o.id).includes(q) ||
      o.customer?.full_name?.toLowerCase().includes(q) ||
      o.status.toLowerCase().includes(q)
    )
  })

  const stats = {
    total: orders.length,
    pending: orders.filter((o: Order) => o.status === 'pending').length,
    completed: orders.filter((o: Order) => o.status === 'completed').length,
    cancelled: orders.filter((o: Order) => o.status === 'cancelled').length,
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-1">Track and manage customer orders</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
          New Order
        </Button>
      </motion.div>

      {/* Stats strip */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total', value: stats.total, color: 'text-foreground', bg: 'bg-card' },
          { label: 'Pending', value: stats.pending, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/20' },
          { label: 'Completed', value: stats.completed, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
          { label: 'Cancelled', value: stats.cancelled, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/20' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border border-border rounded-2xl px-4 py-3 flex items-center justify-between`}>
            <span className="text-sm text-muted-foreground font-medium">{s.label}</span>
            <span className={`text-xl font-heading font-bold ${s.color}`}>{s.value}</span>
          </div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl text-sm bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </motion.div>

      {/* Orders Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-3xl p-5 animate-pulse">
              <div className="flex gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-muted rounded w-1/3" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              </div>
              <div className="h-6 bg-muted rounded w-1/4 ml-auto" />
            </div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 gap-4"
        >
          <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center">
            <ShoppingCart className="w-10 h-10 text-muted-foreground" />
          </div>
          <p className="text-lg font-semibold text-foreground">No orders found</p>
          <p className="text-muted-foreground text-sm">Create your first order to get started</p>
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
            New Order
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredOrders.map((order: Order) => (
            <OrderCard key={order.id} order={order} onDelete={() => setDeleteConfirm(order)} />
          ))}
        </div>
      )}

      {/* Create Order Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); reset({ items: [{ product_id: 0, quantity: 1 }] }) }}
        title="Create New Order"
        description="Select a customer and add products to the order"
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Customer */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Customer</label>
            <select
              {...register('customer_id')}
              className="w-full px-3.5 py-2.5 rounded-2xl text-sm bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value={0}>Select a customer...</option>
              {(customers as Customer[]).map((c) => (
                <option key={c.id} value={c.id}>{c.full_name} — {c.email}</option>
              ))}
            </select>
            {errors.customer_id && <p className="text-xs text-red-500">{errors.customer_id.message}</p>}
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Status</label>
            <select
              {...register('status')}
              className="w-full px-3.5 py-2.5 rounded-2xl text-sm bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Order Items</label>
              <button
                type="button"
                onClick={() => append({ product_id: 0, quantity: 1 })}
                className="text-xs font-semibold text-navy-700 dark:text-golden-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Item
              </button>
            </div>

            {fields.map((field, index) => {
              const selectedProduct = (products as Product[]).find(
                (p) => p.id === Number(watchedItems[index]?.product_id)
              )
              return (
                <div key={field.id} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <select
                      {...register(`items.${index}.product_id`)}
                      className="w-full px-3 py-2.5 rounded-2xl text-sm bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value={0}>Select product...</option>
                      {(products as Product[]).map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {formatCurrency(p.price)} (stock: {p.quantity})
                        </option>
                      ))}
                    </select>
                    {selectedProduct && (
                      <p className="text-xs text-muted-foreground mt-1 pl-1">
                        Available: {selectedProduct.quantity} units
                      </p>
                    )}
                  </div>
                  <input
                    type="number"
                    min={1}
                    {...register(`items.${index}.quantity`)}
                    className="w-20 px-3 py-2.5 rounded-2xl text-sm bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-center"
                    placeholder="Qty"
                  />
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2.5 rounded-2xl hover:bg-red-50 dark:hover:bg-red-950/30 text-muted-foreground hover:text-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )
            })}
            {errors.items && <p className="text-xs text-red-500">{errors.items.message}</p>}
          </div>

          {/* Total preview */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl">
            <span className="text-sm font-medium text-muted-foreground">Estimated Total</span>
            <span className="text-xl font-heading font-bold text-foreground">{formatCurrency(calculateTotal())}</span>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => { setModalOpen(false); reset({ items: [{ product_id: 0, quantity: 1 }] }) }}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" loading={createMutation.isPending}>
              Create Order
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Order" size="sm">
        <div className="space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-2xl">
            <p className="text-sm text-red-700 dark:text-red-400">
              Delete order <strong>#{String(deleteConfirm?.id).padStart(4, '0')}</strong>? Stock will be restored automatically.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button
              variant="danger"
              className="flex-1"
              loading={deleteMutation.isPending}
              onClick={() => deleteConfirm && deleteMutation.mutate(deleteConfirm.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
