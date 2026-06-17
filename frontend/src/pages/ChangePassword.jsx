import { useState } from 'react'
import api from '../api/client'
import { useNavigate } from 'react-router-dom'

export default function ChangePassword(){
  const [password,setPassword]=useState('')
  const [confirm,setConfirm]=useState('')
  const [loading,setLoading]=useState(false)
  const nav = useNavigate()

  const submit=async e=>{
    e.preventDefault()
    if(password!==confirm){ alert('Passwords do not match'); return }
    try{
      setLoading(true)
      await api.put('/auth/password',{password})
      alert('Password updated')
      setLoading(false)
      nav('/')
    }catch(err){ setLoading(false); alert(err.response?.data?.errors?.[0]?.msg || err.response?.data?.error || 'Error') }
  }

  return (
    <div className="card">
      <h2>Change Password</h2>
      <form onSubmit={submit}>
        <input type="password" placeholder="New password" value={password} onChange={e=>setPassword(e.target.value)} required/>
        <input type="password" placeholder="Confirm new password" value={confirm} onChange={e=>setConfirm(e.target.value)} required/>
        <button disabled={loading}>{loading? 'Saving...' : 'Save'}</button>
      </form>
    </div>
  )
}
