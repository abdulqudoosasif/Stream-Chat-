import React from 'react'
import { Redirect, Stack } from 'expo-router'
import { useAuth } from '../provider/authProvider'

const AuthLayout = () => {
    const {user} =useAuth();
    if(user){
        return <Redirect href='/(home)'/>
    }
  return (
   <Stack>
    <Stack.Screen name='login' options={{title:'Login'}}/>
   </Stack>
  )
}

export default AuthLayout