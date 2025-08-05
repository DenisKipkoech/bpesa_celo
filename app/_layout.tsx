import 'react-native-get-random-values';
import { Buffer } from 'buffer';
global.Buffer = Buffer;

import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/colors';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // Add custom fonts here if needed
  });

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      {/* <StatusBar style="auto" /> */}
      <StatusBar style="light" translucent={false} backgroundColor={Colors.primary} />
      <RootLayoutNav />
    </SafeAreaProvider>
  );
}

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.background,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="get-started" options={{ headerShown: false }} />
      <Stack.Screen name="kyc-setup" options={{ headerShown: false }} />
      <Stack.Screen name="pin-setup" options={{ headerShown: false }} />
      <Stack.Screen name="pin-verify" options={{ headerShown: false }} />
      <Stack.Screen name="recovery-backup" options={{ headerShown: false }} />
      <Stack.Screen name="wallet-restore" options={{ headerShown: false }} />
      <Stack.Screen 
        name="(tabs)" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="transactions/[id]" 
        options={{ 
          title: "Transaction Details",
        }} 
      />
      <Stack.Screen 
        name="send-money" 
        options={{ 
          title: "Send Money",
        }} 
      />
      <Stack.Screen 
        name="send-amount" 
        options={{ 
          title: "Enter Amount",
        }} 
      />
      <Stack.Screen 
        name="send-confirm" 
        options={{ 
          title: "Confirm Transaction",
        }} 
      />
      <Stack.Screen 
        name="transaction-progress" 
        options={{ 
          title: "",
          headerBackVisible: false,
        }} 
      />
      <Stack.Screen 
        name="receive-money" 
        options={{ 
          title: "Receive Money",
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="load-money" 
        options={{ 
          title: "Load Money",
        }} 
      />
      <Stack.Screen 
        name="load-mpesa" 
        options={{ 
          title: "Load from M-Pesa",
        }} 
      />
      <Stack.Screen 
        name="withdraw-money" 
        options={{ 
          title: "Withdraw Money",
        }} 
      />
      <Stack.Screen 
        name="withdraw-agent" 
        options={{ 
          title: "Withdraw at Agent",
        }} 
      />
      <Stack.Screen 
        name="qr-scanner" 
        options={{ 
          title: "Scan QR Code",
        }} 
      />
      <Stack.Screen 
        name="contact-picker" 
        options={{ 
          title: "Select Contact",
        }} 
      />
    </Stack>
  );
}