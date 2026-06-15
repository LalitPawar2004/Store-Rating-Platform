import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/client'

const Ctx = createContext()
export const useAuth = ()=> useContext(Ctx)

export function AuthProvider({children}){
  const [user,setUser] = useState(null)
  useEffect(()=>{
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    const name = localStorage.getItem('name')
    if(token) setUser({token, role, name})
  },[])
  const login = async (email,password)=>{
    const {data} = await api.post('/auth/login',{email,password})
    localStorage.setItem('token', data.token)
    localStorage.setItem('role', data.role)
    localStorage.setItem('name', data.name)
    setUser(data)
    return data
  }
  const logout = ()=>{ localStorage.clear(); setUser(null) }
  return <Ctx.Provider value={{user,login,logout}}>{children}</Ctx.Provider>
}
