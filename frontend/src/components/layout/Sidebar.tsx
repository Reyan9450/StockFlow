import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Warehouse,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Zap,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/products', label: 'Products', icon: Package },
  { path: '/customers', label: 'Customers', icon: Users },
  { path: '/orders', label: 'Orders', icon: ShoppingCart },
  { path: '/inventory', label: 'Inventory', icon: Warehouse },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
]

const bottomItems = [
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/help', label: 'Help Center', icon: HelpCircle },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onLogout: () => void
}

export function Sidebar({ isOpen, onClose, onLogout }: SidebarProps) {
  const location = useLocation()

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className={cn(
          'fixed left-0 top-0 h-full w-[260px] z-50 flex flex-col',
          'bg-navy-800 dark:bg-navy-950',
          'shadow-sidebar',
          'lg:translate-x-0 lg:static lg:z-auto',
          'sidebar-scroll overflow-y-auto'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-golden flex items-center justify-center shadow-glow">
              <Zap className="w-5 h-5 text-navy-900" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-white font-heading font-bold text-lg leading-none">Stockify</h1>
              <p className="text-white/40 text-xs mt-0.5">Inventory Platform</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-white/50 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="text-white/30 text-xs font-medium uppercase tracking-wider px-3 mb-3">
            Main Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className="block"
              >
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-golden-500 text-navy-900 shadow-glow'
                      : 'text-white/60 hover:text-white hover:bg-white/8'
                  )}
                >
                  <Icon
                    className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-navy-900' : '')}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className={cn('font-medium text-sm', isActive ? 'font-semibold' : '')}>
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-navy-800"
                    />
                  )}
                </motion.div>
              </NavLink>
            )
          })}
        </nav>

        {/* Bottom items */}
        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <NavLink key={item.path} to={item.path} onClick={onClose} className="block">
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-golden-500 text-navy-900'
                      : 'text-white/60 hover:text-white hover:bg-white/8'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                  <span className="font-medium text-sm">{item.label}</span>
                </motion.div>
              </NavLink>
            )
          })}

          {/* Logout */}
          <motion.button
            whileHover={{ x: 4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
            <span className="font-medium text-sm">Logout</span>
          </motion.button>
        </div>

        {/* Version badge */}
        <div className="px-6 py-4">
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <p className="text-white/30 text-xs">Stockify v1.0.0</p>
            <p className="text-white/20 text-xs mt-0.5">Production Ready</p>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
