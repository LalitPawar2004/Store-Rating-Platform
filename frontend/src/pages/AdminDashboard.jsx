import { useEffect, useState } from 'react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard(){
  const [stats,setStats]=useState({})
  const [users,setUsers]=useState([])
  const [stores,setStores]=useState([])

  const [userFilters,setUserFilters]=useState({name:'',email:'',address:'',role:''})
  const [storeFilters,setStoreFilters]=useState({name:'',email:'',address:''})

  const [userSort,setUserSort]=useState('name')
  const [userOrder,setUserOrder]=useState('asc')
  const [storeSort,setStoreSort]=useState('name')
  const [storeOrder,setStoreOrder]=useState('asc')

  const [showAddUser,setShowAddUser]=useState(false)
  const [showAddStore,setShowAddStore]=useState(false)
  const [newUser,setNewUser]=useState({name:'',email:'',address:'',password:'',role:'user'})
  const [newStore,setNewStore]=useState({name:'',email:'',address:'',owner_id:''})
  const [owners,setOwners]=useState([])

  const [userDetail,setUserDetail]=useState(null)
  const [detailVisible,setDetailVisible]=useState(false)
  const {logout}=useAuth()
  const nav = useNavigate()

  const loadStats = ()=> api.get('/admin/dashboard').then(r=>setStats(r.data))
  const loadUsers = ()=> api.get('/admin/users',{params:{...userFilters, sort:userSort, order:userOrder}}).then(r=>setUsers(r.data))
  const loadStores = ()=> api.get('/admin/stores',{params:{...storeFilters, sort:storeSort, order:storeOrder}}).then(r=>setStores(r.data))

  useEffect(()=>{ loadStats(); loadUsers(); loadStores() },[])

  useEffect(()=>{ loadUsers() }, [userSort, userOrder])
  useEffect(()=>{ loadStores() }, [storeSort, storeOrder])

  const toggleUserSort = col => {
    if(userSort===col) setUserOrder(o=> o==='asc' ? 'desc' : 'asc')
    else { setUserSort(col); setUserOrder('asc') }
  }

  const toggleStoreSort = col => {
    if(storeSort===col) setStoreOrder(o=> o==='asc' ? 'desc' : 'asc')
    else { setStoreSort(col); setStoreOrder('asc') }
  }

  const submitAddUser=async e=>{
    e.preventDefault()
    try{
      await api.post('/admin/users', newUser)
      setShowAddUser(false)
      setNewUser({name:'',email:'',address:'',password:'',role:'user'})
      loadUsers()
    }catch(err){ alert(err.response?.data?.errors?.[0]?.msg || err.response?.data?.error) }
  }

  const submitAddStore=async e=>{
    e.preventDefault()
    try{
      await api.post('/admin/stores', newStore)
      setShowAddStore(false)
      setNewStore({name:'',email:'',address:'',owner_id:''})
      loadStores()
    }catch(err){ alert(err.response?.data?.errors?.[0]?.msg || err.response?.data?.error) }
  }

  const loadOwners = ()=> api.get('/admin/users',{params:{role:'owner'}}).then(r=>setOwners(r.data))

  // when showing add-store form, load owners for dropdown
  useEffect(()=>{ if(showAddStore) loadOwners() }, [showAddStore])

  const viewUser=async id=>{
    try{
      const {data} = await api.get(`/admin/users/${id}`)
      setUserDetail(data)
      setDetailVisible(true)
    }catch(e){ alert('Unable to fetch user') }
  }

  return (
    <div className="wrap">
      <header><h2>Admin Dashboard</h2><div><button onClick={()=>nav('/change-password')}>Change Password</button> <button onClick={logout}>Logout</button></div></header>
      <div className="grid3">
        <div className="stat">Users: {stats.totalUsers}</div>
        <div className="stat">Stores: {stats.totalStores}</div>
        <div className="stat">Ratings: {stats.totalRatings}</div>
      </div>

      <h3>Users</h3>
      <div className="filters">
        <input placeholder="Name" value={userFilters.name} onChange={e=>setUserFilters({...userFilters,name:e.target.value})}/>
        <input placeholder="Email" value={userFilters.email} onChange={e=>setUserFilters({...userFilters,email:e.target.value})}/>
        <input placeholder="Address" value={userFilters.address} onChange={e=>setUserFilters({...userFilters,address:e.target.value})}/>
        <select value={userFilters.role} onChange={e=>setUserFilters({...userFilters,role:e.target.value})}>
          <option value="">All roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="owner">Owner</option>
        </select>
        <button onClick={loadUsers}>Search</button>
        <button onClick={()=>setShowAddUser(s=>!s)}>{showAddUser? 'Cancel':'Add User'}</button>
      </div>

      {showAddUser && (
        <form className="card" onSubmit={submitAddUser}>
          <input placeholder="Name" value={newUser.name} onChange={e=>setNewUser({...newUser,name:e.target.value})} required/>
          <input placeholder="Email" value={newUser.email} onChange={e=>setNewUser({...newUser,email:e.target.value})} required/>
          <input placeholder="Address" value={newUser.address} onChange={e=>setNewUser({...newUser,address:e.target.value})}/>
          <input placeholder="Password" value={newUser.password} onChange={e=>setNewUser({...newUser,password:e.target.value})} required/>
          <select value={newUser.role} onChange={e=>setNewUser({...newUser,role:e.target.value})}>
            <option value="user">User</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
          </select>
          <button>Create</button>
        </form>
      )}

      <table><thead><tr>
        <th style={{cursor:'pointer'}} onClick={()=>toggleUserSort('name')}>Name {userSort==='name' && (userOrder==='asc'?'↑':'↓')}</th>
        <th style={{cursor:'pointer'}} onClick={()=>toggleUserSort('email')}>Email {userSort==='email' && (userOrder==='asc'?'↑':'↓')}</th>
        <th style={{cursor:'pointer'}} onClick={()=>toggleUserSort('address')}>Address {userSort==='address' && (userOrder==='asc'?'↑':'↓')}</th>
        <th style={{cursor:'pointer'}} onClick={()=>toggleUserSort('role')}>Role {userSort==='role' && (userOrder==='asc'?'↑':'↓')}</th>
      </tr></thead>
      <tbody>{users.map(u=>(<tr key={u.id} style={{cursor:'pointer'}} onClick={()=>viewUser(u.id)}><td>{u.name}</td><td>{u.email}</td><td>{u.address}</td><td>{u.role}</td></tr>))}</tbody></table>

      <h3>Stores</h3>
      <div className="filters">
        <input placeholder="Name" value={storeFilters.name} onChange={e=>setStoreFilters({...storeFilters,name:e.target.value})}/>
        <input placeholder="Email" value={storeFilters.email} onChange={e=>setStoreFilters({...storeFilters,email:e.target.value})}/>
        <input placeholder="Address" value={storeFilters.address} onChange={e=>setStoreFilters({...storeFilters,address:e.target.value})}/>
        <button onClick={loadStores}>Search</button>
        <button onClick={()=>setShowAddStore(s=>!s)}>{showAddStore? 'Cancel':'Add Store'}</button>
      </div>

      {showAddStore && (
        <form className="card" onSubmit={submitAddStore}>
          <input placeholder="Name" value={newStore.name} onChange={e=>setNewStore({...newStore,name:e.target.value})} required/>
          <input placeholder="Email" value={newStore.email} onChange={e=>setNewStore({...newStore,email:e.target.value})}/>
          <input placeholder="Address" value={newStore.address} onChange={e=>setNewStore({...newStore,address:e.target.value})}/>
            <select value={newStore.owner_id||''} onChange={e=>setNewStore({...newStore,owner_id:e.target.value})}>
              <option value="">No owner</option>
              {owners.map(o=> <option key={o.id} value={o.id}>{o.name} ({o.email})</option>)}
            </select>
          <button>Create</button>
        </form>
      )}

      <table><thead><tr>
        <th style={{cursor:'pointer'}} onClick={()=>toggleStoreSort('name')}>Name {storeSort==='name' && (storeOrder==='asc'?'↑':'↓')}</th>
        <th style={{cursor:'pointer'}} onClick={()=>toggleStoreSort('email')}>Email {storeSort==='email' && (storeOrder==='asc'?'↑':'↓')}</th>
        <th style={{cursor:'pointer'}} onClick={()=>toggleStoreSort('address')}>Address {storeSort==='address' && (storeOrder==='asc'?'↑':'↓')}</th>
        <th style={{cursor:'pointer'}} onClick={()=>toggleStoreSort('rating')}>Rating {storeSort==='rating' && (storeOrder==='asc'?'↑':'↓')}</th>
      </tr></thead>
      <tbody>{stores.map(s=><tr key={s.id}><td>{s.name}</td><td>{s.email}</td><td>{s.address}</td><td>{Number(s.rating).toFixed(1)}</td></tr>)}</tbody></table>

      {detailVisible && userDetail && (
        <div className="card">
          <h3>User Details</h3>
          <div><strong>Name:</strong> {userDetail.name}</div>
          <div><strong>Email:</strong> {userDetail.email}</div>
          <div><strong>Address:</strong> {userDetail.address}</div>
          <div><strong>Role:</strong> {userDetail.role}</div>
          {userDetail.role==='owner' && <div><strong>Owner Rating:</strong> {userDetail.ownerRating}</div>}
          <button onClick={()=>setDetailVisible(false)}>Close</button>
        </div>
      )}
    </div>
  )
}
