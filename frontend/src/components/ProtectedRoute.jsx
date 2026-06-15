import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({allow, children}){
  const {user} = useAuth()
  if(!user) return <Navigate to="/login"/>
  if(!allow.includes(user.role)) return <Navigate to="/"/>
  return children
}
