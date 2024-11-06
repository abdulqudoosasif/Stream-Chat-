import {  FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../provider/authProvider'
import UserList from '../../components/UserList'

const UsersScreen = () => {
    const [users, setUsers] = useState([])
    const {user}=useAuth()

    useEffect(() => {
        const fetchUsers = async () => {
            let { data: profiles, error } = await supabase
                .from('profiles')
                .select('*')
                .neq('id',user.id)

            if (error) {
                console.error("Error fetching users:", error)
            } else {
                setUsers(profiles)
            }
        }
        fetchUsers()
    }, [])

    return (
        <FlatList 
            data={users} 
            contentContainerStyle={{gap:5}}
            keyExtractor={(item) => item.id.toString()} 
            renderItem={({ item }) => <UserList user={item}/>}
        />
    )
}

export default UsersScreen
