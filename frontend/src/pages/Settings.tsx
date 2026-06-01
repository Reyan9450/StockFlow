import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Palette, Bell, Key, Shield, Save, Sun, Moon, Monitor, Check } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'theme', label: 'Theme', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'api', label: 'API Settings', icon: Key },
  { id: 'security', label: 'Security', icon: Shield },
]

function ProfileTab() {
  const [saving, setSaving] = useState(false)
  const handleSave = () => {
    setSaving(true)
    setTimeout(() => { setSaving(false); toast.success('Profile updated') }, 1000)
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
          AJ
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Profile Photo</h3>
          <p className="text-sm text-muted-foreground mt-0.5">JPG, PNG or GIF. Max 2MB.</p>
          <button className="mt-2 text-sm font-medium text-navy-700 dark:text-golden-400 hover:underline">
            Upload new photo
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="First Name" defaultValue="Admin" />
        <Input label="Last Name" defaultValue="User" />
        <Input label="Email" type="email" defaultValue="admin@stockify.io" />
        <Input label="Phone" defaultValue="+1-555-0100" />
        <Input label="Company" defaultValue="Stockify Inc." />
        <Input label="Role" defaultValue="Super Admin" />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Bio</label>
        <textarea
          rows={3}
          defaultValue="Managing inventory and operations at Stockify."
          className="w-full px-3.5 py-2.5 rounded-2xl text-sm bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>
      <Button onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>
        Save Changes
      </Button>
    </div>
  )
}

function ThemeTab() {
  const { theme, toggleTheme } = useTheme()
  const themes = [
    { id: 'light', label: 'Light', icon: Sun, desc: 'Clean and bright interface' },
    { id: 'dark', label: 'Dark', icon: Moon, desc: 'Easy on the eyes at night' },
    { id: 'system', label: 'System', icon: Monitor, desc: 'Follows your OS preference' },
  ]
  const [accent, setAccent] = useState('navy')
  const accents = [
    { id: 'navy', color: '#16324f', label: 'Ocean Navy' },
    { id: 'golden', color: '#f4c542', label: 'Golden Yellow' },
    { id: 'emerald', color: '#22c55e', label: 'Emerald' },
    { id: 'violet', color: '#8b5cf6', label: 'Violet' },
    { id: 'rose', color: '#f43f5e', label: 'Rose' },
  ]
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold text-foreground mb-1">Color Mode</h3>
        <p className="text-sm text-muted-foreground mb-4">Choose how Stockify looks to you</p>
        <div className="grid grid-cols-3 gap-3">
          {themes.map((t) => {
            const isActive = t.id === 'system' ? false : theme === t.id
            return (
              <motion.button
                key={t.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => t.id !== 'system' && toggleTheme()}
                className={cn(
                  'relative p-4 rounded-2xl border-2 text-left transition-all',
                  isActive ? 'border-navy-700 dark:border-golden-500 bg-navy-50 dark:bg-golden-950/20' : 'border-border hover:border-muted-foreground/30'
                )}
              >
                {isActive && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-navy-700 dark:bg-golden-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white dark:text-navy-900" />
                  </div>
                )}
                <t.icon className="w-6 h-6 text-muted-foreground mb-2" />
                <p className="text-sm font-semibold text-foreground">{t.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
              </motion.button>
            )
          })}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-foreground mb-1">Accent Color</h3>
        <p className="text-sm text-muted-foreground mb-4">Personalize your brand color</p>
        <div className="flex gap-3">
          {accents.map((a) => (
            <motion.button
              key={a.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => setAccent(a.id)}
              title={a.label}
              className={cn(
                'w-10 h-10 rounded-2xl border-2 transition-all',
                accent === a.id ? 'border-foreground scale-110' : 'border-transparent'
              )}
              style={{ backgroundColor: a.color }}
            >
              {accent === a.id && <Check className="w-4 h-4 text-white mx-auto" />}
            </motion.button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-foreground mb-1">Sidebar Style</h3>
        <p className="text-sm text-muted-foreground mb-4">Choose sidebar appearance</p>
        <div className="flex gap-3">
          {['Compact', 'Default', 'Wide'].map((s) => (
            <button
              key={s}
              className={cn(
                'px-4 py-2 rounded-2xl text-sm font-medium border transition-all',
                s === 'Default' ? 'border-navy-700 dark:border-golden-500 bg-navy-50 dark:bg-golden-950/20 text-foreground' : 'border-border text-muted-foreground hover:text-foreground'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function NotificationsTab() {
  const [settings, setSettings] = useState({
    lowStock: true, newOrder: true, orderComplete: true, newCustomer: false,
    emailDigest: true, pushNotif: false, smsAlerts: false,
  })
  const toggle = (key: keyof typeof settings) => setSettings((s) => ({ ...s, [key]: !s[key] }))

  const groups = [
    {
      title: 'Inventory Alerts',
      items: [
        { key: 'lowStock', label: 'Low stock alerts', desc: 'Notify when product stock falls below 10 units' },
      ],
    },
    {
      title: 'Order Notifications',
      items: [
        { key: 'newOrder', label: 'New order placed', desc: 'Get notified when a new order is created' },
        { key: 'orderComplete', label: 'Order completed', desc: 'Notify when an order status changes to completed' },
      ],
    },
    {
      title: 'Customer Activity',
      items: [
        { key: 'newCustomer', label: 'New customer registered', desc: 'Alert when a new customer is added' },
      ],
    },
    {
      title: 'Delivery Channels',
      items: [
        { key: 'emailDigest', label: 'Email digest', desc: 'Receive a daily summary via email' },
        { key: 'pushNotif', label: 'Push notifications', desc: 'Browser push notifications' },
        { key: 'smsAlerts', label: 'SMS alerts', desc: 'Critical alerts via SMS' },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.title}>
          <h3 className="font-semibold text-foreground mb-3">{group.title}</h3>
          <div className="space-y-3">
            {group.items.map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
                <button
                  onClick={() => toggle(item.key as keyof typeof settings)}
                  className={cn(
                    'relative w-11 h-6 rounded-full transition-colors duration-200',
                    settings[item.key as keyof typeof settings] ? 'bg-navy-700 dark:bg-golden-500' : 'bg-muted-foreground/30'
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200',
                      settings[item.key as keyof typeof settings] ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
      <Button icon={<Save className="w-4 h-4" />} onClick={() => toast.success('Notification preferences saved')}>
        Save Preferences
      </Button>
    </div>
  )
}

function ApiTab() {
  const [copied, setCopied] = useState(false)
  const apiKey = 'sk_live_stockify_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'
  const copy = () => {
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('API key copied')
  }
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-foreground mb-1">API Key</h3>
        <p className="text-sm text-muted-foreground mb-4">Use this key to authenticate API requests</p>
        <div className="flex gap-2">
          <div className="flex-1 px-4 py-3 bg-muted/50 border border-border rounded-2xl font-mono text-sm text-muted-foreground truncate">
            {apiKey.slice(0, 20)}{'•'.repeat(20)}
          </div>
          <Button variant="outline" onClick={copy} icon={copied ? <Check className="w-4 h-4" /> : undefined}>
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-foreground mb-1">API Base URL</h3>
        <div className="px-4 py-3 bg-muted/50 border border-border rounded-2xl font-mono text-sm text-muted-foreground">
          {import.meta.env.VITE_API_URL || 'http://localhost:8000'}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-foreground mb-3">Rate Limits</h3>
        <div className="space-y-3">
          {[
            { endpoint: 'GET /products', limit: '1000 req/min', used: 42 },
            { endpoint: 'POST /orders', limit: '100 req/min', used: 8 },
            { endpoint: 'GET /dashboard/stats', limit: '60 req/min', used: 15 },
          ].map((r) => (
            <div key={r.endpoint} className="p-4 bg-muted/30 rounded-2xl">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-mono font-medium text-foreground">{r.endpoint}</span>
                <span className="text-xs text-muted-foreground">{r.used} / {r.limit}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-navy-700 dark:bg-golden-500 rounded-full" style={{ width: `${(r.used / parseInt(r.limit)) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Button variant="danger" onClick={() => toast.error('API key regenerated — update your integrations')}>
        Regenerate API Key
      </Button>
    </div>
  )
}

function SecurityTab() {
  const [saving, setSaving] = useState(false)
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-foreground mb-1">Change Password</h3>
        <p className="text-sm text-muted-foreground mb-4">Use a strong password with at least 12 characters</p>
        <div className="space-y-3 max-w-sm">
          <Input label="Current Password" type="password" placeholder="••••••••••••" />
          <Input label="New Password" type="password" placeholder="••••••••••••" />
          <Input label="Confirm New Password" type="password" placeholder="••••••••••••" />
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-foreground mb-3">Two-Factor Authentication</h3>
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">2FA is enabled</p>
            <p className="text-xs text-emerald-600/70 dark:text-emerald-500/70 mt-0.5">Your account is protected with authenticator app</p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-foreground mb-3">Active Sessions</h3>
        <div className="space-y-3">
          {[
            { device: 'Chrome on macOS', location: 'New York, US', time: 'Active now', current: true },
            { device: 'Safari on iPhone', location: 'New York, US', time: '2 hours ago', current: false },
          ].map((s) => (
            <div key={s.device} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
              <div>
                <p className="text-sm font-medium text-foreground">{s.device}</p>
                <p className="text-xs text-muted-foreground">{s.location} · {s.time}</p>
              </div>
              {s.current ? (
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full">Current</span>
              ) : (
                <button className="text-xs font-medium text-red-500 hover:underline">Revoke</button>
              )}
            </div>
          ))}
        </div>
      </div>
      <Button
        loading={saving}
        icon={<Save className="w-4 h-4" />}
        onClick={() => { setSaving(true); setTimeout(() => { setSaving(false); toast.success('Security settings saved') }, 1000) }}
      >
        Update Password
      </Button>
    </div>
  )
}

const tabContent: Record<string, React.ReactNode> = {
  profile: <ProfileTab />,
  theme: <ThemeTab />,
  notifications: <NotificationsTab />,
  api: <ApiTab />,
  security: <SecurityTab />,
}

export function Settings() {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and application preferences</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar tabs */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:w-56 flex-shrink-0"
        >
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-navy-800 dark:bg-golden-500 text-white dark:text-navy-900'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <tab.icon className="w-4 h-4 flex-shrink-0" />
                {tab.label}
              </button>
            ))}
          </nav>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="flex-1 bg-card border border-border rounded-3xl p-6 shadow-card"
        >
          <h2 className="text-xl font-heading font-bold text-foreground mb-6">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h2>
          {tabContent[activeTab]}
        </motion.div>
      </div>
    </div>
  )
}
