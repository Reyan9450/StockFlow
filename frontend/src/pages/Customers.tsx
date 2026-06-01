import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Search, Trash2, Users, Mail, Phone, ShoppingBag, LayoutGrid, List } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { customersApi } from '@/services/api'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { formatDate, generateAvatarColor, getInitials } from '@/lib/utils'
import type { Customer } from '@/types'

const customerSchema = z.object({
  full_name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
})

type CustomerFormData = z.infer<typeof customerSchema>

function CustomerCard({ customer, onDelete }: { customer: Customer; onDelete: () => void }) {
  const avatarGradient = generateAvatarColor(customer.full_name)
  const initials = getInitials(customer.full_name)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-card border border-border rounded-3xl p-5 shadow-card hover:shadow-card-hover transition-shadow group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-bold text-sm`}>
          {initials}
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onDelete}
          className="p-2 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-950/30 text-muted-foreground hover:text-red-600 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      <h3 className="font-heading font-semibold text-foreground text-base">{customer.full_name}</h3>

      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{customer.email}</span>
        </div>
        {customer.phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{customer.phone}</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm">
          <ShoppingBag className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-semibold text-foreground">{customer.total_orders ?? 0}</span>
          <span className="text-muted-foreground">orders</span>
        </div>
        <span className="text-xs text-muted-foreground">Since {formatDate(customer.created_at)}</span>
      </div>
    </motion.div>
  )
}

export function Customers() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<Customer | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers', search],
    queryFn: () => customersApi.getAll({ search: search || undefined }),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormData>({ resolver: zodResolver(customerSchema) })

  const createMutation = useMutation({
    mutationFn: customersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      toast.success('Customer added successfully')
      setModalOpen(false)
      reset()
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: customersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      toast.success('Customer deleted')
      setDeleteConfirm(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const onSubmit = (data: CustomerFormData) => {
    createMutation.mutate(data)
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
          <h1 className="text-3xl font-heading font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground mt-1">Manage your customer relationships</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
          Add Customer
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3 items-start sm:items-center"
      >
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-2xl text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span className="font-medium">{customers.length}</span> customers
        </div>
        {/* View toggle */}
        <div className="flex items-center bg-card border border-border rounded-2xl p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-xl transition-colors ${viewMode === 'grid' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-xl transition-colors ${viewMode === 'list' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5' : 'space-y-3'}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-3xl p-5 animate-pulse">
              <div className="w-12 h-12 rounded-2xl bg-muted mb-4" />
              <div className="h-4 bg-muted rounded-xl w-3/4 mb-3" />
              <div className="h-3 bg-muted rounded-xl w-full mb-2" />
              <div className="h-3 bg-muted rounded-xl w-2/3" />
            </div>
          ))}
        </div>
      ) : customers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 gap-4"
        >
          <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center">
            <Users className="w-10 h-10 text-muted-foreground" />
          </div>
          <p className="text-lg font-semibold text-foreground">No customers yet</p>
          <p className="text-muted-foreground text-sm">Add your first customer to get started</p>
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
            Add Customer
          </Button>
        </motion.div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {customers.map((customer: Customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onDelete={() => setDeleteConfirm(customer)}
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-card border border-border rounded-3xl overflow-hidden shadow-card"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['Customer', 'Email', 'Phone', 'Orders', 'Member Since', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customers.map((customer: Customer, idx: number) => {
                const avatarGradient = generateAvatarColor(customer.full_name)
                const initials = getInitials(customer.full_name)
                return (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-bold text-xs`}>
                          {initials}
                        </div>
                        <span className="text-sm font-semibold text-foreground">{customer.full_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{customer.email}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{customer.phone ?? '—'}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-foreground">{customer.total_orders ?? 0}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{formatDate(customer.created_at)}</td>
                    <td className="px-5 py-4">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setDeleteConfirm(customer)}
                        className="p-2 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-950/30 text-muted-foreground hover:text-red-600 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </motion.button>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); reset() }}
        title="Add New Customer"
        description="Enter customer details to add them to your CRM"
        size="sm"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Alex Johnson"
            error={errors.full_name?.message}
            {...register('full_name')}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="alex@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Phone (optional)"
            placeholder="+1-555-0100"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => { setModalOpen(false); reset() }}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" loading={createMutation.isPending}>
              Add Customer
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Customer"
        size="sm"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-2xl">
            <p className="text-sm text-red-700 dark:text-red-400">
              Delete <strong>{deleteConfirm?.full_name}</strong>? This will also remove all associated orders.
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
