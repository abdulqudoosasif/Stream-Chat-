import React, { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { StyleSheet, View, Alert, ScrollView } from 'react-native'
import { Button, Input } from '@rneui/themed'
import { useAuth } from '../../provider/authProvider'
import Avatar from '../../../components/ProfileImage'

export default function ProfileScreen() {
  const { session } = useAuth()
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [website, setWebsite] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    if (session) getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user in the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        .select('username, website, avatar_url, full_name')
        .eq('id', session?.user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
        setFullName(data.full_name)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user in the session!')

      const updates = {
        id: session.user.id,
        username,
        website,
        avatar_url: avatarUrl,
        full_name: fullName,
        updated_at: new Date(),
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }



  return (
    <ScrollView className='pt-3 px-4 '>
      <View style={styles.avatarContainer}>
        <Avatar
          size={200}
          url={avatarUrl}
          onUpload={(url) => {
            setAvatarUrl(url)
            updateProfile()
          }}
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Input label="Email" value={session?.user?.email} disabled />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Username" value={username} onChangeText={setUsername} />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Full Name" value={fullName} onChangeText={setFullName} />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Website" value={website} onChangeText={setWebsite} />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? 'Loading ...' : 'Update'}
          onPress={updateProfile}
          disabled={loading}
        />
      </View>

      <View className='mb-10' style={styles.verticallySpaced}>
        <Button
          title="Sign Out"
          onPress={async () => {
            try {
              await supabase.auth.signOut()
              // Optionally navigate to a login screen or perform other actions
            } catch (error) {
              Alert.alert('Failed to sign out')
            }
          }}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})
