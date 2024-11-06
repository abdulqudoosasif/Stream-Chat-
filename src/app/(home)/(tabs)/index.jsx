import { ChannelList } from 'stream-chat-expo';
import { Link, Redirect, router, Stack } from 'expo-router';
import React from 'react';
import { useAuth } from '../../provider/authProvider';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';
const MainTab = () => {
  const {user} =useAuth()

  return (
    
  <>
  {/* <Redirect href={'/(home)/calls'}/> */}
  <Stack.Screen options={{headerRight:()=>(
   <View className='flex justify-between'>
    <Link href={'/(home)/users'} asChild>
      <Ionicons name="person" size={24} color="gray" style={{ marginHorizontal: 15 }}/>
 </Link>
   </View>
  )}}/>
          <ChannelList
        filters={{ members: { $in: [user.id] } }}
        onSelect={(channel) => router.push(`/channels/${channel.cid}`)}
      />
  </>
  );
};

export default MainTab;
