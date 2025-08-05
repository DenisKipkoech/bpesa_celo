import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { PinInput } from '@/components/PinInput';
import { useWalletStore } from '@/stores/wallet-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CURRENCIES } from '@/constants/constants';

export default function PinSetupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  console.log(params)
  const country = Array.isArray(params.country) ? params.country[0] : params.country;
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const expoToken = Array.isArray(params.expoToken) ? params.expoToken[0] : params.expoToken;

  const { createWallet } = useWalletStore();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');
  const [loading, setLoading] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

   // validate inputs
  if (!country || !id || !expoToken) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red', textAlign: 'center' }}>
          Missing registration data. Please go back.
        </Text>
      </View>
    );
  }

  const handlePinComplete = async (enteredPin: string) => {
    if (step === 'enter') {
      setPin(enteredPin);
      setStep('confirm');
    } else {
      if (enteredPin === pin) {
        setLoading(true);
        setProcessingStep('Verifying PIN...');
        
        try {
          // Add a small delay to show the verification step
          await new Promise(resolve => setTimeout(resolve, 800));
          
          setProcessingStep('Creating account...');
          const { mnemonic, address } = await createWallet(enteredPin, country, id, expoToken, CURRENCIES[0].token);
          
          setProcessingStep('Finalizing setup...');
          await new Promise(resolve => setTimeout(resolve, 500));
          
          router.replace({
            pathname: '/recovery-backup',
            params: { mnemonic, address }
          });
        } catch (error) {
          Alert.alert('Error', 'Failed to create wallet. Please try again.');
        } finally {
          setLoading(false);
          setProcessingStep('');
        }
      } else {
        Alert.alert('PIN Mismatch', 'PINs do not match. Please try again.');
        setPin('');
        setConfirmPin('');
        setStep('enter');
      }
    }
  };

  const handleBack = () => {
    if (loading) return; // Prevent back navigation while loading
    
    if (step === 'confirm') {
      setStep('enter');
      setPin('');
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        {step === 'enter' ? 'Set Your PIN' : 'Confirm Your PIN'}
      </Text>
      <Text style={styles.subtitle}>
        {step === 'enter' 
          ? 'Create a 4-digit PIN to secure your wallet'
          : 'Enter your PIN again to confirm'
        }
      </Text>

      <View style={styles.pinContainer}>
        <PinInput
          onComplete={handlePinComplete}
          loading={loading}
          key={step} // Reset component when step changes
        />


        {/* Success indicator for step completion */}
        {!loading && step === 'confirm' && pin && (
          <Text style={styles.successText}>✓ PIN created, now confirm</Text>
        )}
      </View>

      {loading && (
        <View style={styles.overlay}>
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loaderText}>{processingStep || 'Setting up account...'}</Text>
          </View>
        </View>
      )}

      <View style={styles.infoCard}>
        <Text style={styles.infoText}>
          Your PIN encrypts your wallet keys. Never share it with anyone.
        </Text>
      </View>

      <Button
        title="Back"
        onPress={handleBack}
        variant="outline"
        style={styles.backButton}
        disabled={loading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
    marginTop: 40,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 40,
    textAlign: 'center',
  },
  pinContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 8,
    fontWeight: '500',
  },
  successText: {
    fontSize: 14,
    color: Colors.success || '#22c55e',
    marginTop: 16,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  overlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: 'rgba(0, 0, 0, 0.4)', // semi-transparent background
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
},

loaderBox: {
  backgroundColor: '#fff',
  padding: 24,
  borderRadius: 16,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOpacity: 0.2,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 6,
  elevation: 6,
  width: 240,
},

loaderText: {
  marginTop: 16,
  fontSize: 16,
  fontWeight: '600',
  color: Colors.text,
  textAlign: 'center',
},

  backButton: {
    marginBottom: 20,
  },
});