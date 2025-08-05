import 'react-native-get-random-values';
import { Buffer } from 'buffer';
global.Buffer = Buffer;

import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Animated, Easing, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { useWalletStore } from '@/stores/wallet-store';
import * as Notifications from 'expo-notifications';
import * as Updates from 'expo-updates';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,        // Deprecated, but still used for fallback
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,       // ✅ required
    shouldShowList: true          // ✅ required
  }),
});

export default function SplashScreen() {
  const router = useRouter();
  const { isPinSet ,isWalletCreated,_hasHydrated,resetWalletApp} = useWalletStore();
  const logoScale = new Animated.Value(0.3);
  const logoOpacity = new Animated.Value(0);
  const textOpacity = new Animated.Value(0);

  const checkForUpdates = async () => {
    try {
      // Skip updates in development mode
      if (__DEV__) {
        console.log('Skipping updates check in development mode');
        return;
      }

      console.log('Checking for updates...');
      // await resetWalletApp()
      const update = await Updates.checkForUpdateAsync();
      
      if (update.isAvailable) {
        console.log('Update available, downloading...');
        await Updates.fetchUpdateAsync();
        console.log('Update downloaded, reloading...');
        await Updates.reloadAsync();
      } else {
        console.log('No updates available');
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
      // Continue with normal app flow even if update check fails
    }
  };

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      response => {
        const data = response.notification.request.content.data;
        
        if (data?.type === "transaction" && data?.txId) {
          router.push({
          pathname: "/transactions",
          params: {
           id: String(data.txId)
          },
        });
        }
      }
    );

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!_hasHydrated) return; 

    checkForUpdates();
    // Animate logo
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.back(1.7)),
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
    let timer = 1000;
    // Navigate to onboarding after splash
    if(isPinSet && isWalletCreated){
      timer = setTimeout(() => {
        router.replace('/get-started');
      }, 2500);
    }else{
      timer = setTimeout(() => {
        router.replace('/onboarding');
      }, 2500);
    }
    

    return () => clearTimeout(timer);
  }, [_hasHydrated]);

  if (!_hasHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'blue' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }
  return (
    <LinearGradient
      colors={[Colors.primary, Colors.primaryDark]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScale }],
              opacity: logoOpacity,
            },
          ]}
        >
          <View style={styles.logo}>
            <Text style={styles.logoText}>B</Text>
          </View>
        </Animated.View>
        <Animated.Text style={[styles.appName, { opacity: textOpacity }]}>
          Bpesa
        </Animated.Text>
      </View>
       <View style={styles.versionContainer}>
        <Text style={styles.versionText}>v1.0.9</Text>
        <Text style={styles.buildText}>Built: {new Date().toLocaleDateString()}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 60,
    fontWeight: '700',
    color: Colors.primary,
  },
  appName: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.background,
  },
   versionContainer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.background,
    opacity: 0.8,
  },
  buildText: {
    fontSize: 12,
    color: Colors.background,
    opacity: 0.6,
    marginTop: 4,
  },
});