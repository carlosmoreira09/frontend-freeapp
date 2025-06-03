import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ClientDashboard from './pages/client/ClientDashboard'
import ClientProfile from './pages/client/ClientProfile'
import ClientTransactions from './pages/client/ClientTransactions'
import AddTransaction from './pages/client/AddTransaction'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminClients from './pages/admin/AdminClients'
import AdminSettings from './pages/admin/AdminSettings'
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
          </Route>
          
          {/* Protected admin routes */}
          <Route element={<ProtectedRoute allowedAuthTypes={[AuthType.ADMIN]} adminOnly={true} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/clients" element={<AdminClients />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
          
          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
