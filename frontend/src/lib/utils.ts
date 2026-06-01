import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString))
}

export function formatDateTime(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString))
}

export function getStockStatus(quantity: number): {
  label: string
  color: string
  bg: string
} {
  if (quantity === 0) return { label: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/30' }
  if (quantity < 10) return { label: 'Low Stock', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30' }
  if (quantity < 50) return { label: 'Limited', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30' }
  return { label: 'In Stock', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' }
}

export function getOrderStatusConfig(status: string): {
  label: string
  color: string
  bg: string
  dot: string
} {
  switch (status) {
    case 'completed':
      return { label: 'Completed', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40', dot: 'bg-emerald-500' }
    case 'cancelled':
      return { label: 'Cancelled', color: 'text-red-700 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/40', dot: 'bg-red-500' }
    default:
      return { label: 'Pending', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40', dot: 'bg-amber-500' }
  }
}

export function generateAvatarColor(name: string): string {
  const colors = [
    'from-violet-500 to-purple-600',
    'from-blue-500 to-cyan-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-amber-600',
    'from-pink-500 to-rose-600',
    'from-indigo-500 to-blue-600',
  ]
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
