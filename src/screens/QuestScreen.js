import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const initialQuests = [
  { id: '1', title: 'Complete 1 lesson', done: true },
  { id: '2', title: 'Login today', done: true },
  { id: '3', title: 'Play 1 game', done: false },
  { id: '4', title: 'Answer 3 questions', done: false },
];

const QuestScreen = () => {
  const [quests, setQuests] = useState(initialQuests);

  const renderQuest = ({ item }) => (
    <View style={styles.questItem}>
      <Icon
        name={item.done ? 'check-circle' : 'clock-outline'}
        size={24}
        color={item.done ? '#4CAF50' : '#FFC107'}
        style={{ marginRight: 12 }}
      />
      <Text style={[styles.questText, item.done && styles.doneText]}>
        {item.title}
      </Text>
    </View>
  );

  const allDone = quests.every(q => q.done);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Daily Quests</Text>

      <FlatList
        data={quests}
        renderItem={renderQuest}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {allDone ? (
        <TouchableOpacity style={styles.claimButton}>
          <Text style={styles.claimText}>🎁 Claim Reward</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.note}>Complete all quests to claim your reward!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBE6',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF8000',
    marginBottom: 24,
  },
  questItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },
  questText: {
    fontSize: 16,
    color: '#444',
  },
  doneText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  claimButton: {
    marginTop: 16,
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  claimText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  note: {
    marginTop: 16,
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
  },
});

export default QuestScreen;
