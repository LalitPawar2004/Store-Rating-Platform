import { useEffect, useState } from 'react'
import api from '../api/client'
import StarRating from '../components/StarRating'
import { useAuth } from '../context/AuthContext'

export default function UserStores(){
  const [stores,setStores]=useState([])
  const [q,setQ]=useState({name:'',address:''})
  const {logout}=useAuth()
  const load=()=>api.get('/stores',{params:q}).then(r=>setStores(r.data))
  useEffect(()=>{load()},[])
  const rate=async (id,val)=>{ await api.post('/ratings',{store_id:id,rating:val}); load() }

  return (
    <div className="wrap">
      <header><h2>Stores</h2><button onClick={logout}>Logout</button></header>
      <div className="filters">
        <input placeholder="Search name" value={q.name} onChange={e=>setQ({...q,name:e.target.value})}/>
        <input placeholder="Search address" value={q.address} onChange={e=>setQ({...q,address:e.target.value})}/>
        <button onClick={load}>Search</button>
      </div>
      <table><thead><tr><th>Store</th><th>Address</th><th>Overall</th><th>Your Rating</th></tr></thead>
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
