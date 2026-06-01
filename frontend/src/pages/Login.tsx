import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Zap, ArrowRight, Package, Users, ShoppingCart, BarChart3, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
})

const signupSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
})

type LoginForm = z.infer<typeof loginSchema>
type SignupForm = z.infer<typeof signupSchema>

const DEMO_CREDENTIALS = [
  { label: 'Manager', email: 'manager@Stockify.io', password: 'manager123', role: 'Inventory Manager', color: 'from-blue-500 to-cyan-600' },
  { label: 'Viewer', email: 'viewer@Stockify.io', password: 'viewer123', role: 'Read Only', color: 'from-emerald-500 to-teal-600' },
]

const FEATURES = [
  { icon: Package, label: 'Inventory Tracking', desc: 'Real-time stock management' },
  { icon: ShoppingCart, label: 'Order Management', desc: 'End-to-end order lifecycle' },
  { icon: Users, label: 'Customer CRM', desc: 'Unified customer profiles' },
  { icon: BarChart3, label: 'Analytics', desc: 'Data-driven insights' },
]

interface AuthProps {
  onLogin: (user: { name: string; email: string; role: string }) => void
}

export function AuthPage({ onLogin }: AuthProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })
  const signupForm = useForm<SignupForm>({ resolver: zodResolver(signupSchema) })

  const handleLogin = (data: LoginForm) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      // Accept any of the demo credentials or any email/password combo
      const demo = DEMO_CREDENTIALS.find(d => d.email === data.email && d.password === data.password)
      const user = demo
        ? { name: demo.label + ' User', email: demo.email, role: demo.role }
        : { name: 'Admin User', email: data.email, role: 'Super Admin' }
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`)
      onLogin(user)
    }, 1200)
  }

  const handleSignup = (data: SignupForm) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success('Account created! Welcome to Stockify.')
      onLogin({ name: data.full_name, email: data.email, role: 'Admin' })
    }, 1200)
  }

  const fillDemo = (cred: typeof DEMO_CREDENTIALS[0]) => {
    loginForm.setValue('email', cred.email)
    loginForm.setValue('password', cred.password)
    toast.info(`Filled ${cred.label} credentials`)
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* ── Left Panel ─────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden bg-navy-800 dark:bg-navy-950 flex-col justify-between p-12">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-golden-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.02] border border-white/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-white/[0.02] border border-white/5" />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-golden-400 to-golden-600 flex items-center justify-center shadow-glow">
            <Zap className="w-5 h-5 text-navy-900" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-white font-heading font-bold text-xl leading-none">Stockify</h1>
            <p className="text-white/40 text-xs mt-0.5">Inventory Platform</p>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-golden-500/15 border border-golden-500/30 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-golden-400" />
            <span className="text-golden-400 text-xs font-semibold">Production-Ready SaaS Platform</span>
          </div>

          <h2 className="text-5xl font-heading font-bold text-white leading-tight">
            Manage your
            <span className="block text-golden-400">inventory smarter</span>
          </h2>

          <p className="text-white/50 text-lg leading-relaxed max-w-md">
            A modern cloud-based platform for inventory, orders, and customer management — built for teams that move fast.
          </p>

          {/* Feature list */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {FEATURES.map((f) => (
              <div
                key={f.label}
                className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/[0.08] hover:bg-white/[0.08] transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-4 h-4 text-golden-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{f.label}</p>
                  <p className="text-white/40 text-xs mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative flex items-center gap-8">
          {[
            { value: '10K+', label: 'Products tracked' },
            { value: '99.9%', label: 'Uptime SLA' },
            { value: '50ms', label: 'Avg response' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-heading font-bold text-white">{s.value}</p>
              <p className="text-white/40 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-golden-400 to-golden-600 flex items-center justify-center">
            <Zap className="w-4.5 h-4.5 text-navy-900" strokeWidth={2.5} />
          </div>
          <span className="font-heading font-bold text-xl text-foreground">Stockify</span>
        </div>

        <div className="w-full max-w-md">
          {/* Tab switcher */}
          <div className="flex bg-muted rounded-2xl p-1 mb-8">
            {(['login', 'signup'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setMode(tab)}
                className={cn(
                  'flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                  mode === tab
                    ? 'bg-card text-foreground shadow-card'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {tab === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
              >
                {/* Header */}
                <div className="mb-7">
                  <h2 className="text-2xl font-heading font-bold text-foreground">Welcome back</h2>
                  <p className="text-muted-foreground text-sm mt-1">Sign in to your Stockify account</p>
                </div>

                {/* Demo credentials */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Quick Demo Access
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {DEMO_CREDENTIALS.map((cred) => (
                      <motion.button
                        key={cred.label}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => fillDemo(cred)}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-border hover:border-navy-300 dark:hover:border-navy-600 bg-card hover:bg-muted/50 transition-all group"
                      >
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${cred.color} flex items-center justify-center text-white text-xs font-bold`}>
                          {cred.label[0]}
                        </div>
                        <span className="text-xs font-semibold text-foreground">{cred.label}</span>
                        <span className="text-[10px] text-muted-foreground text-center leading-tight">{cred.role}</span>
                      </motion.button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Click a card to auto-fill credentials
                  </p>
                </div>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-background px-3 text-xs text-muted-foreground">or sign in manually</span>
                  </div>
                </div>

                {/* Login form */}
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Email address</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      {...loginForm.register('email')}
                      className={cn(
                        'w-full px-4 py-3 rounded-2xl text-sm bg-muted/50 border text-foreground placeholder:text-muted-foreground',
                        'focus:outline-none focus:ring-2 focus:ring-navy-500 dark:focus:ring-golden-500 focus:border-transparent transition-all',
                        loginForm.formState.errors.email ? 'border-red-500' : 'border-border'
                      )}
                    />
                    {loginForm.formState.errors.email && (
                      <p className="text-xs text-red-500">{loginForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-foreground">Password</label>
                      <button type="button" className="text-xs text-navy-600 dark:text-golden-400 hover:underline font-medium">
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        {...loginForm.register('password')}
                        className={cn(
                          'w-full px-4 py-3 pr-11 rounded-2xl text-sm bg-muted/50 border text-foreground placeholder:text-muted-foreground',
                          'focus:outline-none focus:ring-2 focus:ring-navy-500 dark:focus:ring-golden-500 focus:border-transparent transition-all',
                          loginForm.formState.errors.password ? 'border-red-500' : 'border-border'
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-xs text-red-500">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="remember"
                      {...loginForm.register('remember')}
                      className="w-4 h-4 rounded accent-navy-700 dark:accent-golden-500"
                    />
                    <label htmlFor="remember" className="text-sm text-muted-foreground">
                      Remember me for 30 days
                    </label>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all',
                      'bg-navy-800 hover:bg-navy-700 text-white dark:bg-golden-500 dark:hover:bg-golden-400 dark:text-navy-900',
                      'disabled:opacity-60 disabled:cursor-not-allowed'
                    )}
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-6">
                  Don't have an account?{' '}
                  <button onClick={() => setMode('signup')} className="text-navy-700 dark:text-golden-400 font-semibold hover:underline">
                    Create one free
                  </button>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
              >
                {/* Header */}
                <div className="mb-7">
                  <h2 className="text-2xl font-heading font-bold text-foreground">Create your account</h2>
                  <p className="text-muted-foreground text-sm mt-1">Start managing your inventory today</p>
                </div>

                {/* Signup form */}
                <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Full Name</label>
                    <input
                      type="text"
                      placeholder="Alex Johnson"
                      {...signupForm.register('full_name')}
                      className={cn(
                        'w-full px-4 py-3 rounded-2xl text-sm bg-muted/50 border text-foreground placeholder:text-muted-foreground',
                        'focus:outline-none focus:ring-2 focus:ring-navy-500 dark:focus:ring-golden-500 focus:border-transparent transition-all',
                        signupForm.formState.errors.full_name ? 'border-red-500' : 'border-border'
                      )}
                    />
                    {signupForm.formState.errors.full_name && (
                      <p className="text-xs text-red-500">{signupForm.formState.errors.full_name.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Email address</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      {...signupForm.register('email')}
                      className={cn(
                        'w-full px-4 py-3 rounded-2xl text-sm bg-muted/50 border text-foreground placeholder:text-muted-foreground',
                        'focus:outline-none focus:ring-2 focus:ring-navy-500 dark:focus:ring-golden-500 focus:border-transparent transition-all',
                        signupForm.formState.errors.email ? 'border-red-500' : 'border-border'
                      )}
                    />
                    {signupForm.formState.errors.email && (
                      <p className="text-xs text-red-500">{signupForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Min. 6 characters"
                        {...signupForm.register('password')}
                        className={cn(
                          'w-full px-4 py-3 pr-11 rounded-2xl text-sm bg-muted/50 border text-foreground placeholder:text-muted-foreground',
                          'focus:outline-none focus:ring-2 focus:ring-navy-500 dark:focus:ring-golden-500 focus:border-transparent transition-all',
                          signupForm.formState.errors.password ? 'border-red-500' : 'border-border'
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {signupForm.formState.errors.password && (
                      <p className="text-xs text-red-500">{signupForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Repeat your password"
                        {...signupForm.register('confirm_password')}
                        className={cn(
                          'w-full px-4 py-3 pr-11 rounded-2xl text-sm bg-muted/50 border text-foreground placeholder:text-muted-foreground',
                          'focus:outline-none focus:ring-2 focus:ring-navy-500 dark:focus:ring-golden-500 focus:border-transparent transition-all',
                          signupForm.formState.errors.confirm_password ? 'border-red-500' : 'border-border'
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {signupForm.formState.errors.confirm_password && (
                      <p className="text-xs text-red-500">{signupForm.formState.errors.confirm_password.message}</p>
                    )}
                  </div>

                  {/* Password strength hint */}
                  <div className="p-3 bg-muted/50 rounded-2xl text-xs text-muted-foreground space-y-1">
                    <p className="font-medium text-foreground">Password requirements:</p>
                    <p>• At least 6 characters long</p>
                    <p>• Both passwords must match</p>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all',
                      'bg-navy-800 hover:bg-navy-700 text-white dark:bg-golden-500 dark:hover:bg-golden-400 dark:text-navy-900',
                      'disabled:opacity-60 disabled:cursor-not-allowed'
                    )}
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-6">
                  Already have an account?{' '}
                  <button onClick={() => setMode('login')} className="text-navy-700 dark:text-golden-400 font-semibold hover:underline">
                    Sign in
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground mt-8">
            By continuing, you agree to Stockify's{' '}
            <span className="underline cursor-pointer">Terms of Service</span> and{' '}
            <span className="underline cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  )
}
