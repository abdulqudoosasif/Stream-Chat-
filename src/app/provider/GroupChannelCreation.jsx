import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { StreamChat } from 'stream-chat';
import { useAuth } from './authProvider';
import { router } from 'expo-router';

const GroupChannelCreation = () => {
  const { user } = useAuth();
  const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY);
  const [allUsers, setAllUsers] = useState([]); 
  const [memberIds, setMemberIds] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await client.queryUsers({});
        setAllUsers(response.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (inputValue) {
      setFilteredUsers(
        allUsers.filter(
          (u) => u.email && u.email.toLowerCase().includes(inputValue.toLowerCase())
        )
      );
    } else {
      setFilteredUsers([]); 
    }
  }, [inputValue, allUsers]);

  const handleAddMember = (userId) => {
    if (!memberIds.includes(userId)) {
      setMemberIds([...memberIds, userId]);
    }
  };

  const handleCreateGroupChannel = async () => {
    if (memberIds.length > 0) {
      const channel = client.channel('messaging', {
        members: [user.id, ...memberIds],
        name: 'Group Chat',
      });
      await channel.create();
      router.push(`/channels/${channel.cid}`);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Create Group Chat</Text>
        <TextInput
          style={styles.input}
          placeholder="Search by email"
          value={inputValue}
          onChangeText={setInputValue}
        />
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              <Text style={styles.member}>{item.email}</Text>
              <Button title="Add" onPress={() => handleAddMember(item.id)} />
            </View>
          )}
          ListEmptyComponent={() => (
            <Text style={styles.noResults}>
              {inputValue ? 'No users found.' : 'Start typing to search by email.'}
            </Text>
          )}
        />
        <Text style={styles.selectedTitle}>Selected Members</Text>
        <FlatList
          data={memberIds}
          keyExtractor={(id) => id}
          renderItem={({ item }) => (
            <Text style={styles.member}>{item}</Text>
          )}
        />
        <Button title="Create Group Channel" onPress={handleCreateGroupChannel} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  member: {
    fontSize: 18,
    paddingVertical: 5,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  noResults: {
    fontSize: 16,
    color: 'gray',
    marginTop: 10,
    textAlign: 'center',
  },
  selectedTitle: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
  },
});

export default GroupChannelCreation;
