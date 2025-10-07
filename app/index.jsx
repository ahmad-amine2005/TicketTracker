import React, { useState } from "react";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomSplash from "../components/customSplash";
import TicketTracker from "../TicketTracker";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  if (isLoading) {
    return <CustomSplash onFinish={() => setIsLoading(false)} />;
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      <StatusBar barStyle="dark-content" />
      <TicketTracker />
    </SafeAreaView>
  );
}
