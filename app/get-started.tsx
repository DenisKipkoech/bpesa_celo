import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, RefreshCw } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { Colors } from '@/constants/colors';
import { useWalletStore } from '@/stores/wallet-store';
import { getCurrentNetwork } from '@/constants/networks';

export default function GetStartedScreen() {
  const router = useRouter();
  const { isWalletCreated } = useWalletStore();

  // Use useEffect to handle navigation after render
  useEffect(() => {
    if (isWalletCreated) {
      router.replace({
        pathname: '/pin-verify',
        params: { returnTo: '/(tabs)' }
      });
    }
  }, [isWalletCreated, router]);

  const handleKycSetup = () => {
    router.push('/kyc-setup');
  };

  const handleRestoreWallet = () => {
    router.push('/wallet-restore');
  };

  // Show loading or return null while navigating
  if (isWalletCreated) {
    return null; // or a loading spinner
  }

  const network = getCurrentNetwork();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Welcome to Bpesa</Text>
          <Text style={styles.subtitle}>
            Your secure mobile money solution
          </Text>
        </View>

        <View style={styles.featuresSection}>
          <View style={styles.featureItem}>
            <Text style={styles.featureText}>🔒 Secure transactions</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureText}>⚡ Low fees & fast transfers</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureText}>🛡️ Complete privacy & control</Text>
          </View>
        </View>

        <View style={styles.ctaSection}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleKycSetup}>
            <View style={styles.buttonIcon}>
              <Plus size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.primaryButtonText}>Create New Account</Text>
            <Text style={styles.primaryButtonSubtext}>
              Start sending and receiving money securely
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.secondarySection}>
          <TouchableOpacity style={styles.linkButton} onPress={handleRestoreWallet}>
            <RefreshCw size={16} color={Colors.primary} />
            <Text style={styles.linkButtonText}>Already have an account? Restore it</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '400',
  },
  featuresSection: {
    width: '100%',
    marginBottom: 48,
  },
  featureItem: {
    marginBottom: 12,
    alignItems: 'center',
  },
  featureText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  ctaSection: {
    width: '100%',
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  primaryButtonSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  secondarySection: {
    alignItems: 'center',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  linkButtonText: {
    fontSize: 16,
    color: Colors.primary,
    marginLeft: 8,
    fontWeight: '500',
  },
});