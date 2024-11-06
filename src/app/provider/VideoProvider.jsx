import {
    StreamVideoClient,
    StreamVideo,
  } from '@stream-io/video-react-native-sdk';
  import { useEffect, useState } from 'react';
  import { ActivityIndicator, View } from 'react-native';
  import { tokenProvider } from '../../utils/tokenProvider';
  import { useAuth } from './authProvider';
  import { supabase } from '../../lib/supabase';
  
  const apiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY;
  
  export default function VideoProvider({ children }) {
    const [videoClient, setVideoClient] = useState(null);
    const { profile } = useAuth();
  
    useEffect(() => {
      if (!profile) {
        return;
      }
  
      const initVideoClient = async () => {
        const user = {
          id: profile.id,
          name: profile.full_name,
          image: supabase.storage.from('avatars').getPublicUrl(profile.avatar_url)
            .data.publicUrl,
        };
        const client = new StreamVideoClient({ apiKey, user, tokenProvider });
        setVideoClient(client);
      };
  
      initVideoClient();
  
      return () => {
        if (videoClient) {
          videoClient.disconnectUser();
        }
      };
    }, [profile?.id]);
  
    if (!videoClient) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    }
  
    return <StreamVideo client={videoClient}>{children}</StreamVideo>;
  }