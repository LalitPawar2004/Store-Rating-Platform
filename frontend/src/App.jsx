import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import UserStores from './pages/UserStores.jsx'
import OwnerDashboard from './pages/OwnerDashboard.jsx'
import ChangePassword from './pages/ChangePassword.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { useAuth } from './context/AuthContext.jsx'

export default function App(){
  const {user} = useAuth()
  return (
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/admin" element={<ProtectedRoute allow={['admin']}><AdminDashboard/></ProtectedRoute>}/>
      <Route path="/stores" element={<ProtectedRoute allow={['user']}><UserStores/></ProtectedRoute>}/>
      <Route path="/owner" element={<ProtectedRoute allow={['owner']}><OwnerDashboard/></ProtectedRoute>}/>
      <Route path="/change-password" element={<ProtectedRoute allow={['admin','user','owner']}><ChangePassword/></ProtectedRoute>}/>
      <Route path="/" element={user ? <Navigate to={user.role==='admin'?'/admin':user.role==='owner'?'/owner':'/stores'}/> : <Navigate to="/login"/>}/>
    </Routes>
  )
}
