import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Search, Sun, Moon, Menu, ChevronDown, User, Settings, LogOut } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'
import { getInitials, generateAvatarColor } from '@/lib/utils'
import type { AuthUser } from '@/hooks/useAuth'

interface TopNavProps {
  onMenuClick: () => void
  pageTitle: string
  user: AuthUser | null
  onLogout: () => void
}

export function TopNav({ onMenuClick, pageTitle, user, onLogout }: TopNavProps) {
  const { theme, toggleTheme } = useTheme()
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date())

  const initials = user ? getInitials(user.name) : 'AU'
  const avatarGradient = user ? generateAvatarColor(user.name) : 'from-violet-500 to-purple-600'

  return (
    <header className="h-[72px] bg-card border-b border-border flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-30">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title (mobile) */}
      <div className="lg:hidden flex-1">
        <h2 className="font-heading font-semibold text-foreground">{pageTitle}</h2>
      </div>

      {/* Search bar */}
      <div className="hidden lg:flex flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products, orders, customers..."
            className={cn(
              'w-full pl-10 pr-4 py-2.5 rounded-xl text-sm',
              'bg-muted/60 border border-border',
              'text-foreground placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
              'transition-all duration-200'
            )}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Date */}
        <div className="hidden xl:block text-sm text-muted-foreground font-medium px-3">
          {today}
        </div>

        {/* Theme toggle */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="p-2.5 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </motion.button>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false) }}
            className="relative p-2.5 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </motion.button>

          {notifOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-2xl shadow-modal p-4 z-50"
            >
              <h3 className="font-semibold text-sm text-foreground mb-3">Notifications</h3>
              <div className="space-y-3">
                {[
                  { title: 'Low stock alert', desc: 'Sony WH-1000XM5 has only 8 units left', time: '2m ago', dot: 'bg-amber-500' },
                  { title: 'New order placed', desc: 'Order #31 from Alex Johnson', time: '15m ago', dot: 'bg-emerald-500' },
                  { title: 'Stock critical', desc: 'Standing Desk 60" has only 3 units', time: '1h ago', dot: 'bg-red-500' },
                ].map((n, i) => (
                  <div key={i} className="flex gap-3 p-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className={cn('w-2 h-2 rounded-full mt-1.5 flex-shrink-0', n.dot)} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{n.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{n.desc}</p>
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{n.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false) }}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-muted transition-colors"
          >
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white text-xs font-bold`}>
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-foreground leading-none">{user?.name ?? 'Admin'}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{user?.role ?? 'Super Admin'}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
          </motion.button>

          {profileOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-2xl shadow-modal p-2 z-50"
            >
              <div className="px-3 py-2 mb-1">
                <p className="text-sm font-semibold text-foreground">{user?.name ?? 'Admin User'}</p>
                <p className="text-xs text-muted-foreground">{user?.email ?? 'admin@stockflow.io'}</p>
              </div>
              <div className="border-t border-border my-1" />
              {[
                { icon: User, label: 'Profile' },
                { icon: Settings, label: 'Settings' },
              ].map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
              <div className="border-t border-border my-1" />
              <button
                onClick={() => { setProfileOpen(false); onLogout() }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Click outside to close */}
      {(profileOpen || notifOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setProfileOpen(false); setNotifOpen(false) }}
        />
      )}
    </header>
  )
}
