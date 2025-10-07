import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaView} from 'react-native-safe-area-context';
import TicketTracker from '../TicketTracker';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
      <StatusBar barStyle="dark-content" />
      <TicketTracker />
    </SafeAreaView>
  );
}
