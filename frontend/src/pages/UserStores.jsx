import { useEffect, useState } from 'react'
import api from '../api/client'
import StarRating from '../components/StarRating'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function UserStores(){
  const [stores,setStores]=useState([])
  const [q,setQ]=useState({name:'',address:''})
  const {logout}=useAuth()
  const nav = useNavigate()
  const [sort,setSort]=useState('name')
  const [order,setOrder]=useState('asc')
  const load=()=>api.get('/stores',{params:{...q, sort, order}}).then(r=>setStores(r.data))
  useEffect(()=>{load()},[])
  useEffect(()=>{ load() }, [sort, order])
  const toggleSort = col => { if(sort===col) setOrder(o=> o==='asc' ? 'desc' : 'asc'); else { setSort(col); setOrder('asc') } }
  const rate=async (id,val)=>{ await api.post('/ratings',{store_id:id,rating:val}); load() }

  return (
    <div className="wrap">
      <header><h2>Stores</h2><div><button onClick={()=>nav('/change-password')}>Change Password</button> <button onClick={logout}>Logout</button></div></header>
      <div className="filters">
        <input placeholder="Search name" value={q.name} onChange={e=>setQ({...q,name:e.target.value})}/>
        <input placeholder="Search address" value={q.address} onChange={e=>setQ({...q,address:e.target.value})}/>
        <button onClick={load}>Search</button>
      </div>
      <table><thead><tr>
        <th style={{cursor:'pointer'}} onClick={()=>toggleSort('name')}>Store {sort==='name' && (order==='asc'?'↑':'↓')}</th>
        <th style={{cursor:'pointer'}} onClick={()=>toggleSort('address')}>Address {sort==='address' && (order==='asc'?'↑':'↓')}</th>
        <th style={{cursor:'pointer'}} onClick={()=>toggleSort('overallRating')}>Overall {sort==='overallRating' && (order==='asc'?'↑':'↓')}</th>
        <th>Your Rating</th>
      </tr></thead>
      <tbody>{stores.map(s=>(
        <tr key={s.id}>
          <td>{s.name}</td><td>{s.address}</td>
          <td>{Number(s.overallRating).toFixed(1)}</td>
          <td><StarRating value={s.userRating||0} onChange={v=>rate(s.id,v)}/></td>
        </tr>
      ))}</tbody></table>
    </div>
  )
}
