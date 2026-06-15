import { useState } from 'react'
import api from '../api/client'
import { useNavigate } from 'react-router-dom'

export default function Signup(){
  const [form,setForm]=useState({name:'',email:'',address:'',password:''})
  const nav=useNavigate()
  const submit=async e=>{
    e.preventDefault()
    try{ await api.post('/auth/signup', form); alert('Created, now login'); nav('/login') }
    catch(err){ alert(err.response?.data?.errors?.[0]?.msg || err.response?.data?.error) }
  }
  return (
    <div className="card">
      <h2>Sign Up (Normal User)</h2>
      <form onSubmit={submit}>
        <input placeholder="Name (20-60 chars)" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>
        <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/>
        <input placeholder="Address (max 400)" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/>
        <input type="password" placeholder="Password 8-16, 1 uppercase, 1 special" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/>
        <button>Create</button>
      </form>
    </div>
  )
}
