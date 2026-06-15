import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Login(){
  const [email,setEmail]=useState('user@test.com')
  const [password,setPassword]=useState('Admin@123')
  const {login}=useAuth()
  const nav=useNavigate()
  const submit=async e=>{e.preventDefault(); const u=await login(email,password); nav(u.role==='admin'?'/admin':u.role==='owner'?'/owner':'/stores')}
  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/>
        <button>Login</button>
      </form>
      <p>New? <Link to="/signup">Sign up</Link></p>
      <p style={{fontSize:12,opacity:.7}}>Demo: admin@platform.test / user@test.com / owner@test.com — password Admin@123</p>
    </div>
  )
}
