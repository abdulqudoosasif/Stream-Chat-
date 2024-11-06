import {  ActivityIndicator, SafeAreaView, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Channel as ChannelType, useChatContext } from 'stream-chat-expo';
import { Channel, MessageInput, MessageList } from 'stream-chat-expo'; 
import Ionicons from '@expo/vector-icons/Ionicons';
import { useStreamVideoClient } from '@stream-io/video-react-native-sdk';
import * as Crypto from 'expo-crypto';

const Index = () => {
  const [channel, setChannel] = useState (null);
  const { cid } = useLocalSearchParams(); 
  const {client} =useChatContext();
  const videoClient = useStreamVideoClient();

  useEffect(()=>{
    const fetchChannel =async()=>{
        const channels =await client.queryChannels({cid:cid})
        setChannel(channels[0])
    }
    fetchChannel();
  },[cid])

  const joinCall = async () => {
   
    const members = Object.values(channel.state.members).map((member) => ({
      user_id: member.user_id,
    }));

    // create a call using the channel members
    const call = videoClient.call('default', Crypto.randomUUID());
    await call.getOrCreate({
      ring: true,
      data: {
        members,
      },
    });

    // navigate to the call screen
    // router.push(`/calls/${call.id}`);
  };

 if(!channel){
  return <ActivityIndicator/>
 }
  
  return(
    <Channel channel={channel}>
          <Stack.Screen
        options={{
          headerRight: () => (
            <Ionicons name="call" size={20} color="gray" onPress={joinCall} />
          ),
        }}
      />
        <MessageList/>
        <SafeAreaView edges={['bottom']}>
        <MessageInput audioRecordingEnabled/>
        </SafeAreaView>
    </Channel>
)
};

export default Index;
