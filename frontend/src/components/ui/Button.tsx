import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
}

const variants = {
  primary: 'bg-navy-800 hover:bg-navy-700 text-white dark:bg-golden-500 dark:hover:bg-golden-400 dark:text-navy-900',
  secondary: 'bg-muted hover:bg-muted/80 text-foreground',
  ghost: 'hover:bg-muted text-muted-foreground hover:text-foreground',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  outline: 'border border-border hover:bg-muted text-foreground',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-2xl gap-2',
  lg: 'px-6 py-3 text-base rounded-2xl gap-2.5',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, icon, children, className, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          icon && <span className="flex-shrink-0">{icon}</span>
        )}
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
