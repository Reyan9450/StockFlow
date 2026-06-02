import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Eye, EyeOff, Zap, ArrowRight, Package, Users, ShoppingCart,
  BarChart3, Sparkles, ChevronDown, Warehouse, TrendingUp,
  Shield, Globe, Star, CheckCircle2, ArrowUpRight,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { findTeamMemberByEmail } from '@/hooks/useTeam'

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

interface AuthProps {
  onLogin: (user: { name: string; email: string; role: string }) => void
}

// ── Animated section wrapper ───────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── Stats ──────────────────────────────────────────────────────────────────
const STATS = [
  { value: '10K+', label: 'Products Managed' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '50ms', label: 'Avg Response' },
  { value: '500+', label: 'Active Teams' },
]

// ── Features ───────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: Package, title: 'Smart Inventory', desc: 'Track every SKU in real-time. Get alerts before you run out. Never oversell again.', color: 'from-navy-700 to-navy-900' },
  { icon: ShoppingCart, title: 'Order Management', desc: 'Create orders in seconds. Auto-reduce stock. Full order lifecycle in one place.', color: 'from-violet-500 to-purple-700' },
  { icon: Users, title: 'Customer CRM', desc: 'Unified customer profiles with order history, contact info and purchase patterns.', color: 'from-emerald-500 to-teal-700' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Revenue trends, inventory turnover, top products — all in beautiful charts.', color: 'from-golden-500 to-amber-600' },
  { icon: Warehouse, title: 'Warehouse Visualization', desc: 'Interactive floor plan view. See exactly which sections are full, low, or empty.', color: 'from-rose-500 to-pink-700' },
  { icon: Shield, title: 'Role-Based Access', desc: 'Manager and Viewer roles. Invite your team. Control who can edit and who can only view.', color: 'from-cyan-500 to-blue-700' },
]

// ── Testimonials ────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: 'Alex Johnson', role: 'Operations Manager', company: 'TechCorp', text: 'Stockify replaced our spreadsheet chaos. The warehouse visualization alone saved us 3 hours a week.', avatar: 'AJ' },
  { name: 'Sarah Williams', role: 'Inventory Lead', company: 'RetailChain', text: 'The low stock alerts are a game changer. We haven\'t had a stockout since we switched.', avatar: 'SW' },
  { name: 'Michael Chen', role: 'Founder', company: 'StartupVentures', text: 'Beautiful UI, fast API, and the Docker setup made deployment trivial. Exactly what we needed.', avatar: 'MC' },
]

export function AuthPage({ onLogin }: AuthProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const landingRef = useRef<HTMLDivElement>(null)

  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })
  const signupForm = useForm<SignupForm>({ resolver: zodResolver(signupSchema) })

  const handleLogin = (data: LoginForm) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      const demo = DEMO_CREDENTIALS.find(
        d => d.email.toLowerCase() === data.email.toLowerCase() && d.password === data.password
      )
      if (demo) {
        toast.success(`Welcome back, ${demo.label}!`)
        onLogin({ name: demo.label + ' User', email: demo.email, role: demo.role })
        return
      }
      const invited = findTeamMemberByEmail(data.email)
      if (invited && data.password === 'viewer123') {
        toast.success(`Welcome, ${invited.name}!`)
        onLogin({ name: invited.name, email: invited.email, role: 'Read Only' })
        return
      }
      loginForm.setError('password', { message: 'Invalid email or password' })
    }, 1200)
  }

  const handleSignup = (data: SignupForm) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success('Account created! Welcome to Stockify.')
      onLogin({ name: data.full_name, email: data.email, role: 'Read Only' })
    }, 1200)
  }

  const fillDemo = (cred: typeof DEMO_CREDENTIALS[0]) => {
    loginForm.setValue('email', cred.email)
    loginForm.setValue('password', cred.password)
    toast.info(`Filled ${cred.label} credentials`)
  }

  const scrollToLanding = () => {
    landingRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════════
          SECTION 1 — Login Panel (full viewport height)
      ══════════════════════════════════════════════════════════ */}
      <div className="min-h-screen flex relative">

        {/* Left branding panel */}
        <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden bg-navy-800 dark:bg-navy-950 flex-col justify-between p-12">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-golden-500/10 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.02] border border-white/5" />
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
          {/* Hero */}
          <div className="relative space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-golden-500/15 border border-golden-500/30 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-golden-400" />
              <span className="text-golden-400 text-xs font-semibold">Production-Ready SaaS Platform</span>
            </div>
            <h2 className="text-5xl font-heading font-bold text-white leading-tight">
              Manage your<span className="block text-golden-400">inventory smarter</span>
            </h2>
            <p className="text-white/50 text-lg leading-relaxed max-w-md">
              A modern cloud-based platform for inventory, orders, and customer management — built for teams that move fast.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { icon: Package, label: 'Inventory Tracking', desc: 'Real-time stock management' },
                { icon: ShoppingCart, label: 'Order Management', desc: 'End-to-end order lifecycle' },
                { icon: Users, label: 'Customer CRM', desc: 'Unified customer profiles' },
                { icon: BarChart3, label: 'Analytics', desc: 'Data-driven insights' },
              ].map((f) => (
                <div key={f.label} className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/[0.08]">
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
          {/* Stats */}
          <div className="relative flex items-center gap-8">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-heading font-bold text-white">{s.value}</p>
                <p className="text-white/40 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
          {/* Scroll CTA */}
          <button
            onClick={scrollToLanding}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30 hover:text-white/60 transition-colors group"
          >
            <span className="text-xs font-medium">Learn more</span>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </button>
        </div>

        {/* Right auth panel */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 overflow-y-auto relative">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-golden-400 to-golden-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-navy-900" strokeWidth={2.5} />
            </div>
            <span className="font-heading font-bold text-xl text-foreground">Stockify</span>
          </div>
          <div className="w-full max-w-md">
            {/* Tab switcher */}
            <div className="flex bg-muted rounded-2xl p-1 mb-8">
              {(['login', 'signup'] as const).map((tab) => (
                <button key={tab} onClick={() => setMode(tab)}
                  className={cn('flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                    mode === tab ? 'bg-card text-foreground shadow-card' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {tab === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {mode === 'login' ? (
                <motion.div key="login" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
                  <div className="mb-7">
                    <h2 className="text-2xl font-heading font-bold text-foreground">Welcome back</h2>
                    <p className="text-muted-foreground text-sm mt-1">Sign in to your Stockify account</p>
                  </div>
                  {/* Demo cards */}
                  <div className="mb-6">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Demo Access</p>
                    <div className="grid grid-cols-2 gap-2">
                      {DEMO_CREDENTIALS.map((cred) => (
                        <motion.button key={cred.label} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => fillDemo(cred)}
                          className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-border hover:border-navy-300 dark:hover:border-navy-600 bg-card hover:bg-muted/50 transition-all"
                        >
                          <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${cred.color} flex items-center justify-center text-white text-xs font-bold`}>{cred.label[0]}</div>
                          <span className="text-xs font-semibold text-foreground">{cred.label}</span>
                          <span className="text-[10px] text-muted-foreground text-center leading-tight">{cred.role}</span>
                        </motion.button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">Click a card to auto-fill credentials</p>
                  </div>
                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                    <div className="relative flex justify-center"><span className="bg-background px-3 text-xs text-muted-foreground">or sign in manually</span></div>
                  </div>
                  {/* Login form */}
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Email address</label>
                      <input type="email" placeholder="you@example.com" {...loginForm.register('email')}
                        className={cn('w-full px-4 py-3 rounded-2xl text-sm bg-muted/50 border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-navy-500 dark:focus:ring-golden-500 focus:border-transparent transition-all',
                          loginForm.formState.errors.email ? 'border-red-500' : 'border-border')} />
                      {loginForm.formState.errors.email && <p className="text-xs text-red-500">{loginForm.formState.errors.email.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-foreground">Password</label>
                        <button type="button" className="text-xs text-navy-600 dark:text-golden-400 hover:underline font-medium">Forgot password?</button>
                      </div>
                      <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...loginForm.register('password')}
                          className={cn('w-full px-4 py-3 pr-11 rounded-2xl text-sm bg-muted/50 border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-navy-500 dark:focus:ring-golden-500 focus:border-transparent transition-all',
                            loginForm.formState.errors.password ? 'border-red-500' : 'border-border')} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {loginForm.formState.errors.password && <p className="text-xs text-red-500">{loginForm.formState.errors.password.message}</p>}
                    </div>
                    <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.98 }}
                      className={cn('w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all',
                        'bg-navy-800 hover:bg-navy-700 text-white dark:bg-golden-500 dark:hover:bg-golden-400 dark:text-navy-900 disabled:opacity-60 disabled:cursor-not-allowed')}>
                      {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
                    </motion.button>
                  </form>
                  <p className="text-center text-sm text-muted-foreground mt-6">
                    Don't have an account?{' '}
                    <button onClick={() => setMode('signup')} className="text-navy-700 dark:text-golden-400 font-semibold hover:underline">Create one free</button>
                  </p>
                </motion.div>
              ) : (
                <motion.div key="signup" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
                  <div className="mb-7">
                    <h2 className="text-2xl font-heading font-bold text-foreground">Create your account</h2>
                    <p className="text-muted-foreground text-sm mt-1">Start managing your inventory today</p>
                  </div>
                  <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Full Name</label>
                      <input type="text" placeholder="Alex Johnson" {...signupForm.register('full_name')}
                        className={cn('w-full px-4 py-3 rounded-2xl text-sm bg-muted/50 border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-navy-500 dark:focus:ring-golden-500 focus:border-transparent transition-all',
                          signupForm.formState.errors.full_name ? 'border-red-500' : 'border-border')} />
                      {signupForm.formState.errors.full_name && <p className="text-xs text-red-500">{signupForm.formState.errors.full_name.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Email address</label>
                      <input type="email" placeholder="you@example.com" {...signupForm.register('email')}
                        className={cn('w-full px-4 py-3 rounded-2xl text-sm bg-muted/50 border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-navy-500 dark:focus:ring-golden-500 focus:border-transparent transition-all',
                          signupForm.formState.errors.email ? 'border-red-500' : 'border-border')} />
                      {signupForm.formState.errors.email && <p className="text-xs text-red-500">{signupForm.formState.errors.email.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Password</label>
                      <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters" {...signupForm.register('password')}
                          className={cn('w-full px-4 py-3 pr-11 rounded-2xl text-sm bg-muted/50 border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-navy-500 dark:focus:ring-golden-500 focus:border-transparent transition-all',
                            signupForm.formState.errors.password ? 'border-red-500' : 'border-border')} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {signupForm.formState.errors.password && <p className="text-xs text-red-500">{signupForm.formState.errors.password.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Confirm Password</label>
                      <div className="relative">
                        <input type={showConfirm ? 'text' : 'password'} placeholder="Repeat your password" {...signupForm.register('confirm_password')}
                          className={cn('w-full px-4 py-3 pr-11 rounded-2xl text-sm bg-muted/50 border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-navy-500 dark:focus:ring-golden-500 focus:border-transparent transition-all',
                            signupForm.formState.errors.confirm_password ? 'border-red-500' : 'border-border')} />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {signupForm.formState.errors.confirm_password && <p className="text-xs text-red-500">{signupForm.formState.errors.confirm_password.message}</p>}
                    </div>
                    <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.98 }}
                      className={cn('w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all',
                        'bg-navy-800 hover:bg-navy-700 text-white dark:bg-golden-500 dark:hover:bg-golden-400 dark:text-navy-900 disabled:opacity-60 disabled:cursor-not-allowed')}>
                      {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
                    </motion.button>
                  </form>
                  <p className="text-center text-sm text-muted-foreground mt-6">
                    Already have an account?{' '}
                    <button onClick={() => setMode('login')} className="text-navy-700 dark:text-golden-400 font-semibold hover:underline">Sign in</button>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            <p className="text-center text-xs text-muted-foreground mt-8">
              By continuing, you agree to Stockify's{' '}
              <span className="underline cursor-pointer">Terms of Service</span> and{' '}
              <span className="underline cursor-pointer">Privacy Policy</span>
            </p>
          </div>
          {/* Mobile scroll CTA */}
          <button onClick={scrollToLanding} className="lg:hidden mt-8 flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <span className="text-xs">Scroll to learn more</span>
            <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SECTION 2 — Stats Bar
      ══════════════════════════════════════════════════════════ */}
      <div ref={landingRef} className="bg-navy-800 dark:bg-navy-950 py-12 lg:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <FadeIn className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {STATS.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}>
                <p className="text-3xl lg:text-4xl font-heading font-bold text-white">{s.value}</p>
                <p className="text-white/50 text-xs lg:text-sm mt-1">{s.label}</p>
              </motion.div>
            ))}
          </FadeIn>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SECTION 3 — Features
      ══════════════════════════════════════════════════════════ */}
      <div className="py-16 lg:py-24 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-10 lg:mb-16">
            <span className="inline-block px-3 py-1 bg-navy-50 dark:bg-navy-900/50 text-navy-700 dark:text-golden-400 text-xs font-semibold rounded-full mb-4">Everything you need</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-foreground">Built for modern inventory teams</h2>
            <p className="text-muted-foreground mt-3 text-base lg:text-lg max-w-2xl mx-auto">
              From a single warehouse to multi-location operations — Stockify scales with your business.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.07}>
                <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300 }}
                  className="bg-card border border-border rounded-3xl p-6 shadow-card hover:shadow-card-hover transition-shadow h-full">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4`}>
                    <f.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-base font-heading font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SECTION 4 — How it works
      ══════════════════════════════════════════════════════════ */}
      <div className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-10 lg:mb-16">
            <span className="inline-block px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-full mb-4">Simple workflow</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-foreground">Up and running in minutes</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Add your products', desc: 'Import your catalog or add products manually. Set SKUs, prices, and stock levels.', icon: Package },
              { step: '02', title: 'Manage orders', desc: 'Create orders, assign customers, and watch stock update automatically in real-time.', icon: ShoppingCart },
              { step: '03', title: 'Track & analyze', desc: 'Monitor warehouse utilization, revenue trends, and get low stock alerts instantly.', icon: TrendingUp },
            ].map((item, i) => (
              <FadeIn key={item.step} delay={i * 0.15}>
                <div className="relative bg-card border border-border rounded-3xl p-6 text-center shadow-card">
                  <div className="text-4xl font-heading font-bold text-muted/20 mb-4">{item.step}</div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SECTION 5 — Testimonials
      ══════════════════════════════════════════════════════════ */}
      <div className="py-16 lg:py-24 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-10 lg:mb-16">
            <span className="inline-block px-3 py-1 bg-golden-50 dark:bg-golden-900/20 text-golden-700 dark:text-golden-400 text-xs font-semibold rounded-full mb-4">Loved by teams</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-foreground">What our users say</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.1}>
                <motion.div whileHover={{ y: -3 }} className="bg-card border border-border rounded-3xl p-6 shadow-card h-full flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-golden-400 text-golden-400" />)}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">"{t.text}"</p>
                  <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-navy-600 to-navy-800 flex items-center justify-center text-white text-xs font-bold">{t.avatar}</div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role} · {t.company}</p>
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SECTION 6 — Tech Stack
      ══════════════════════════════════════════════════════════ */}
      <div className="py-14 lg:py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <FadeIn>
            <p className="text-sm text-muted-foreground font-medium mb-6">Built with modern, production-grade technology</p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'FastAPI', 'PostgreSQL', 'SQLAlchemy', 'Docker', 'TanStack Query', 'Recharts', 'Zod'].map((tech) => (
                <motion.span key={tech} whileHover={{ scale: 1.05 }}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-card border border-border rounded-2xl text-xs sm:text-sm font-medium text-foreground shadow-sm">
                  {tech}
                </motion.span>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SECTION 7 — CTA
      ══════════════════════════════════════════════════════════ */}
      <div className="py-16 lg:py-24 bg-navy-800 dark:bg-navy-950 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] lg:w-[600px] h-[200px] lg:h-[300px] bg-golden-500/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-golden-500/15 border border-golden-500/30 rounded-full mb-6">
              <Globe className="w-3.5 h-3.5 text-golden-400" />
              <span className="text-golden-400 text-xs font-semibold">Live on Railway & Vercel</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-heading font-bold text-white mb-4 lg:mb-6">
              Ready to take control of your inventory?
            </h2>
            <p className="text-white/50 text-base lg:text-lg mb-8">Sign up for free and get started in under 5 minutes.</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setMode('signup') }}
                className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-golden-500 hover:bg-golden-400 text-navy-900 font-semibold rounded-2xl transition-colors text-sm">
                Get Started Free <ArrowUpRight className="w-4 h-4" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-2xl transition-colors text-sm border border-white/20">
                Sign In Instead
              </motion.button>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════ */}
      <div className="bg-navy-950 py-8 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-golden-400 to-golden-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-navy-900" />
            </div>
            <span className="text-white font-heading font-semibold text-sm">Stockify</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-white/30">
            {['Privacy Policy', 'Terms of Service', 'API Docs', 'GitHub'].map((l) => (
              <button key={l} className="hover:text-white/60 transition-colors">{l}</button>
            ))}
          </div>
          <p className="text-white/20 text-xs">© 2026 Stockify. All rights reserved.</p>
        </div>
      </div>

    </div>
  )
}
