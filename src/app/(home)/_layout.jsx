import React from 'react'
import ChatProvider from '../provider/chat-provider';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../provider/authProvider';
import VideoProvider from '../provider/VideoProvider';
import CallProvider from '../provider/CallProvider';


const _layout = () => {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href='/(auth)/login' />;
  }

  return (
    <ChatProvider>
      <VideoProvider>
        <CallProvider>
        <Stack>
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
          <Stack.Screen name='channels/[cid]'     options={{
          title: 'Chat', headerBackTitle:'Back'}}/>
          <Stack.Screen name='users' options={{ headerBackTitle: "Back", title: 'Users' }} />
          <Stack.Screen name='calls/[id]' options={{ title:"Call", }} />
        </Stack>
        </CallProvider>
      </VideoProvider>
    </ChatProvider>
  );
}

export default _layout;
