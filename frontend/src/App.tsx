import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AppLayout } from '@/components/layout/AppLayout'
import { Dashboard } from '@/pages/Dashboard'
import { Products } from '@/pages/Products'
import { Customers } from '@/pages/Customers'
import { Orders } from '@/pages/Orders'
import { Inventory } from '@/pages/Inventory'
import { Analytics } from '@/pages/Analytics'
import { Settings } from '@/pages/Settings'
import { Help } from '@/pages/Help'
import { AuthPage } from '@/pages/Login'
import { useAuth } from '@/hooks/useAuth'

export default function App() {
  const { user, login, logout, isAuthenticated, isViewer, canEdit } = useAuth()

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '16px',
            border: '1px solid hsl(var(--border))',
            background: 'hsl(var(--card))',
            color: 'hsl(var(--foreground))',
          },
        }}
        richColors
      />

      {!isAuthenticated ? (
        <AuthPage onLogin={login} />
      ) : (
        <Routes>
          <Route element={<AppLayout user={user} onLogout={logout} isViewer={isViewer} />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products canEdit={canEdit} />} />
            <Route path="/customers" element={<Customers canEdit={canEdit} />} />
            <Route path="/orders" element={<Orders canEdit={canEdit} />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      )}
    </BrowserRouter>
  )
}
