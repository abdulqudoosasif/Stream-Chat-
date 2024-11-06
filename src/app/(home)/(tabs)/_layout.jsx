import React from 'react';
import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const _layout = () => {
  return (
    <Tabs>
      <Tabs.Screen 
        name="index" 
        options={{
          title: 'Chats',
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="home" size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen name="profile" options={{ title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="user-circle" size={size} color={color} />
          ) }} />
    </Tabs>
  );
}

export default _layout;
