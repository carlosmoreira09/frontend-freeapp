import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Toaster } from 'react-hot-toast'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ClientDashboard from './pages/client/ClientDashboard'
import ClientProfile from './pages/client/ClientProfile'
import ClientTransactions from './pages/client/ClientTransactions'
import AddTransaction from './pages/client/AddTransaction'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminClients from './pages/admin/AdminClients'
import ClientFormPage from './pages/commum/ClientFormPage.tsx'
import AdminSettings from './pages/admin/AdminSettings'
import AdminDailyTransactions from './pages/admin/AdminDailyTransactions'
import AdminCategories from './pages/admin/AdminCategories'
import AdminProfile from './pages/admin/AdminProfile'
import AdminChangePassword from './pages/admin/AdminChangePassword'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { AuthType } from './types'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Register route - accessible by anyone if registration is enabled, 
              or by admins to register new users */}
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Protected client routes */}
          <Route element={<ProtectedRoute allowedAuthTypes={[AuthType.CLIENT]} />}>
            <Route path="/client/dashboard" element={<ClientDashboard />} />
            <Route path="/client/profile" element={<ClientProfile />} />
            <Route path="/client/transactions" element={<ClientTransactions />} />
            <Route path="/client/add-transaction" element={<AddTransaction />} />
            <Route path="/client/edit/:id" element={<ClientFormPage />} />

          </Route>
          
          {/* Protected admin routes */}
          <Route element={<ProtectedRoute allowedAuthTypes={[AuthType.ADMIN]} adminOnly={true} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/clients" element={<AdminClients />} />
            <Route path="/admin/clients/new" element={<ClientFormPage />} />
            <Route path="/admin/clients/edit/:id" element={<ClientFormPage />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/transactions" element={<AdminDailyTransactions />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/change-password" element={<AdminChangePassword />} />
          </Route>
          
          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#333',
            },
            success: {
              style: {
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#166534',
              },
            },
            error: {
              style: {
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
              },
              duration: 4000,
            },
          }}
        />
      </Router>
    </AuthProvider>
  )
}

export default App
