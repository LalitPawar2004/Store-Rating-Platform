import { useEffect, useState } from 'react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function AdminDashboard(){
  const [stats,setStats]=useState({})
  const [users,setUsers]=useState([])
  const [stores,setStores]=useState([])
  const {logout}=useAuth()

  useEffect(()=>{ api.get('/admin/dashboard').then(r=>setStats(r.data)); loadUsers(); loadStores() },[])
  const loadUsers=()=>api.get('/admin/users').then(r=>setUsers(r.data))
  const loadStores=()=>api.get('/admin/stores').then(r=>setStores(r.data))

  return (
    <div className="wrap">
      <header><h2>Admin Dashboard</h2><button onClick={logout}>Logout</button></header>
      <div className="grid3">
        <div className="stat">Users: {stats.totalUsers}</div>
        <div className="stat">Stores: {stats.totalStores}</div>
        <div className="stat">Ratings: {stats.totalRatings}</div>
      </div>
      <h3>Users</h3>
      <table><thead><tr><th>Name</th><th>Email</th><th>Address</th><th>Role</th></tr></thead>
      <tbody>{users.map(u=><tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.address}</td><td>{u.role}</td></tr>)}</tbody></table>
      <h3>Stores</h3>
      <table><thead><tr><th>Name</th><th>Email</th><th>Address</th><th>Rating</th></tr></thead>
      <tbody>{stores.map(s=><tr key={s.id}><td>{s.name}</td><td>{s.email}</td><td>{s.address}</td><td>{Number(s.rating).toFixed(1)}</td></tr>)}</tbody></table>
    </div>
  )
}
