import { View, Text, Pressable, SafeAreaView } from 'react-native';
import React from 'react';
import { useChatContext } from 'stream-chat-expo';

import { Link, router, Stack } from 'expo-router';
import { useAuth } from '../app/provider/authProvider';
import FontAwesome from '@expo/vector-icons/FontAwesome';
const UserListItem = ({ user }) => {
  const { client } = useChatContext();
  const { user: me } = useAuth();

  const onPress = async () => {
    //start a chat with him
    const channel = client.channel('messaging', {
      members: [me.id, user.id],
    });
    await channel.watch();
    router.replace(`/(home)/channels/${channel.cid}`);
  };

  return (
   <>
    <Stack.Screen
    options={{
      headerRight: () => (
        <Link href="provider/GroupChannelCreation" asChild>
          <FontAwesome name="group" size={22} color="gray" style={{ marginHorizontal: 15 }} />
        </Link>
      ),
    }}
  />
    <Pressable
      onPress={onPress}
      style={{ padding: 15, backgroundColor: 'white' }}
    >
      <Text style={{ fontWeight: '600' }}>{user.full_name}</Text>
    </Pressable>
   </>
  );
};

export default UserListItem;