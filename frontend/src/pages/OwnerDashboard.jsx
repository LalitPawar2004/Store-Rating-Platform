import { useEffect, useState } from 'react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function OwnerDashboard(){
  const [data,setData]=useState({average:0,raters:[]})
  const {logout}=useAuth()
  const nav = useNavigate()
  useEffect(()=>{ api.get('/owner/dashboard').then(r=>setData(r.data)) },[])
  return (
    <div className="wrap">
      <header><h2>Store Owner</h2><div><button onClick={()=>nav('/change-password')}>Change Password</button> <button onClick={logout}>Logout</button></div></header>
      <div className="stat">Average Rating: {data.average}</div>
      <h3>Raters</h3>
      <table><thead><tr><th>Name</th><th>Email</th><th>Rating</th><th>Date</th></tr></thead>
      <tbody>{data.raters?.map((r,i)=><tr key={i}><td>{r.name}</td><td>{r.email}</td><td>{r.rating}</td><td>{new Date(r.updated_at).toLocaleString()}</td></tr>)}</tbody></table>
    </div>
  )
}
