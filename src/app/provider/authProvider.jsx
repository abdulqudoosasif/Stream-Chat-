import React, { useState, useEffect, useContext, createContext } from 'react'
import { supabase } from '../../lib/supabase' 


const AuthContext = createContext({
  session: null,
  user: null,
  profile:null,
})

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [profile,setProfile] = useState();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [])
  useEffect(()=>{
    if(!session?.user){
      return;
    }
    const fetchProfile =async ()=>{
      let { data, error } = await supabase
  .from('profiles')
  .select("*")
  .eq('id',session.user.id)
  .single();
  setProfile(data)
    }
    fetchProfile()
  },[session?.user])
  console.log(profile)

  return (
    <AuthContext.Provider value={{ session, user: session?.user ,profile}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

export default AuthProvider
