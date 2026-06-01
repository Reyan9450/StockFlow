import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  trend?: number
  trendLabel?: string
  icon: LucideIcon
  gradient: string
  iconBg: string
  delay?: number
}

export function StatCard({
  title,
  value,
  trend,
  trendLabel,
  icon: Icon,
  gradient,
  iconBg,
  delay = 0,
}: StatCardProps) {
  const isPositive = trend !== undefined && trend >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        'relative overflow-hidden rounded-3xl p-6',
        'bg-card border border-border shadow-card hover:shadow-card-hover',
        'transition-shadow duration-300 cursor-default'
      )}
    >
      {/* Background gradient accent */}
      <div
        className={cn(
          'absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 -translate-y-8 translate-x-8',
          gradient
        )}
      />

      <div className="relative">
        {/* Icon */}
        <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center mb-4', iconBg)}>
          <Icon className="w-6 h-6 text-white" strokeWidth={2} />
        </div>

        {/* Value */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
        >
          <p className="text-3xl font-heading font-bold text-foreground tracking-tight">{value}</p>
        </motion.div>

        {/* Title */}
        <p className="text-sm font-medium text-muted-foreground mt-1">{title}</p>

        {/* Trend */}
        {trend !== undefined && (
          <div className="flex items-center gap-1.5 mt-3">
            <div
              className={cn(
                'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold',
                isPositive
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
              )}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {Math.abs(trend)}%
            </div>
            {trendLabel && (
              <span className="text-xs text-muted-foreground">{trendLabel}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
