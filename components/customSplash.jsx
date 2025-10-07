import React, { useEffect, useRef } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function CustomSplash({ onFinish }) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(20)).current;
  const textShimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo fade + initial scale
    Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
    Animated.timing(logoScale, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      // Bounce effect
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.08,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });

    // Text fade + slide
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        // Shimmer effect (loop)
        Animated.loop(
          Animated.sequence([
            Animated.timing(textShimmer, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(textShimmer, {
              toValue: 0,
              duration: 800,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();
    }, 700);

    // Hide splash after 3s
    setTimeout(async () => {
      await SplashScreen.hideAsync();
      onFinish();
    }, 3000);
  }, []);

  // Interpolate shimmer color between white and light blue
  const shimmerColor = textShimmer.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FFFFFF", "#BFDBFE"], // white → light blue
  });

  return (
    <LinearGradient colors={["#3B82F6", "#60A5FA"]} style={styles.container}>
      <Animated.Image
        source={require("../assets/images/splash-icon.png")}
        style={[
          styles.logo,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
        resizeMode="contain"
      />
      <Animated.Text
        style={[
          styles.text,
          {
            opacity: textOpacity,
            transform: [{ translateY: textTranslateY }],
            color: shimmerColor,
          },
        ]}
      >
        Connecting Innovation to Agriculture
      </Animated.Text>
      <Animated.View style={{ opacity: textOpacity, marginTop: 30 }}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 180,
    height: 180,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
});
