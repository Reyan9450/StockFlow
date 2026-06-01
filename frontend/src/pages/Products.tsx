import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, Package, Filter, Eye } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { productsApi } from '@/services/api'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatDate, getStockStatus } from '@/lib/utils'
import type { Product } from '@/types'

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Clothing', label: 'Clothing' },
  { value: 'Food & Beverage', label: 'Food & Beverage' },
  { value: 'Tools', label: 'Tools' },
  { value: 'Office Supplies', label: 'Office Supplies' },
  { value: 'Sports', label: 'Sports' },
  { value: 'Home & Garden', label: 'Home & Garden' },
]

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().min(1, 'SKU is required'),
  price: z.coerce.number().min(0, 'Price must be non-negative'),
  quantity: z.coerce.number().int().min(0, 'Quantity must be non-negative'),
  description: z.string().optional(),
  category: z.string().optional(),
  image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
})

type ProductFormData = z.infer<typeof productSchema>

export function Products() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null)

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', search, category],
    queryFn: () => productsApi.getAll({ search: search || undefined, category: category || undefined }),
    select: (data): Product[] => Array.isArray(data) ? data as Product[] : [],
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({ resolver: zodResolver(productSchema) })

  const createMutation = useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      toast.success('Product created successfully')
      setModalOpen(false)
      reset()
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: unknown }) => productsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product updated successfully')
      setModalOpen(false)
      setEditProduct(null)
      reset()
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      toast.success('Product deleted')
      setDeleteConfirm(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const openCreate = () => {
    setEditProduct(null)
    reset({})
    setModalOpen(true)
  }

  const openEdit = (product: Product) => {
    setEditProduct(product)
    reset({
      name: product.name,
      sku: product.sku,
      price: product.price,
      quantity: product.quantity,
      description: product.description ?? '',
      category: product.category ?? '',
      image_url: product.image_url ?? '',
    })
    setModalOpen(true)
  }

  const onSubmit = (data: ProductFormData) => {
    const payload = { ...data, image_url: data.image_url || undefined }
    if (editProduct) {
      updateMutation.mutate({ id: editProduct.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const stockStatusVariant = (qty: number) => {
    if (qty === 0) return 'danger'
    if (qty < 10) return 'warning'
    if (qty < 50) return 'info'
    return 'success'
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
          <h1 className="text-3xl font-heading font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your inventory catalog</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={openCreate}>
          Add Product
        </Button>
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
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl text-sm bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-2xl text-sm text-muted-foreground">
          <Package className="w-4 h-4" />
          <span className="font-medium">{products.length}</span> products
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card border border-border rounded-3xl overflow-hidden shadow-card"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['Product', 'SKU', 'Category', 'Price', 'Stock', 'Status', 'Created', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-muted rounded-xl animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center">
                        <Package className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-base font-semibold text-foreground">No products found</p>
                      <p className="text-sm text-muted-foreground">Add your first product to get started</p>
                      <Button icon={<Plus className="w-4 h-4" />} onClick={openCreate} size="sm">
                        Add Product
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product: Product, idx: number) => {
                  const stockStatus = getStockStatus(product.quantity)
                  return (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center flex-shrink-0">
                            <Package className="w-4 h-4 text-white/70" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{product.name}</p>
                            {product.description && (
                              <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                                {product.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs font-mono font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                          {product.sku}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {product.category ? (
                          <Badge variant="info">{product.category}</Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-foreground">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-foreground">
                        {product.quantity}
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={stockStatusVariant(product.quantity)} dot>
                          {stockStatus.label}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground whitespace-nowrap">
                        {formatDate(product.created_at)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openEdit(product)}
                            className="p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/30 text-muted-foreground hover:text-blue-600 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setDeleteConfirm(product)}
                            className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 text-muted-foreground hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditProduct(null); reset() }}
        title={editProduct ? 'Edit Product' : 'Add New Product'}
        description={editProduct ? 'Update product information' : 'Fill in the details to add a new product'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Product Name"
              placeholder="e.g. MacBook Pro 16"
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="SKU"
              placeholder="e.g. ELEC-001"
              error={errors.sku?.message}
              {...register('sku')}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Price ($)"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.price?.message}
              {...register('price')}
            />
            <Input
              label="Quantity"
              type="number"
              placeholder="0"
              error={errors.quantity?.message}
              {...register('quantity')}
            />
          </div>
          <Select
            label="Category"
            options={CATEGORIES.slice(1).map((c) => ({ value: c.value, label: c.label }))}
            error={errors.category?.message}
            {...register('category')}
          />
          <Textarea
            label="Description"
            placeholder="Product description..."
            error={errors.description?.message}
            {...register('description')}
          />
          <Input
            label="Image URL (optional)"
            placeholder="https://example.com/image.jpg"
            error={errors.image_url?.message}
            {...register('image_url')}
          />
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => { setModalOpen(false); setEditProduct(null); reset() }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {editProduct ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Product"
        size="sm"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-2xl">
            <p className="text-sm text-red-700 dark:text-red-400">
              Are you sure you want to delete <strong>{deleteConfirm?.name}</strong>? This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
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
