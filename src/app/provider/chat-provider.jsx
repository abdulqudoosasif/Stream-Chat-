import React, { useEffect, useState } from 'react'
import { ActivityIndicator } from 'react-native';
import { StreamChat } from 'stream-chat';
import { Chat, OverlayProvider } from 'stream-chat-expo';
import { useAuth } from './authProvider';
import { supabase } from '../../lib/supabase';
import { tokenProvider } from '../../utils/tokenProvider';
const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY);


const ChatProvider = ({children}) => {
    const [isReady, setIsReady] = useState(false)
    const {profile} = useAuth()
    
    useEffect(()=>{
      if(!profile){
        return;
      }
        const connect = async()=>{
    
            await client.connectUser(
              // console.log("Profile",profile.id),
              // console.log("Token",await tokenProvider()),
                {
                  id:profile.id,
                  name: profile.full_name,
                  image: supabase.storage.from('avatars').getPublicUrl(profile.avatar_url).data.publicUrl,
                },
                tokenProvider,
              );
              setIsReady(true)

        // Channel Code

// const channel = client.channel('messaging', 'the_park', {
//     name: 'First Channel',
//   });
//   await channel.watch();
        }
        connect();
        return ()=>{
          if(isReady){
             client.disconnectUser()
          }
          setIsReady(false)
        }
    },[profile?.id])
    if(!isReady){return<ActivityIndicator/>}
  return (
    <OverlayProvider>
        <Chat client={client} >
     {children}
     </Chat>
    </OverlayProvider>
  )
}

export default ChatProvider