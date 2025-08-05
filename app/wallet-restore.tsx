import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { RefreshCw } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { useWalletStore } from '@/stores/wallet-store';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function WalletRestoreScreen() {
  const router = useRouter();
  const { restoreWallet } = useWalletStore();
  const [mnemonic, setMnemonic] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRestore = async () => {
    if (!mnemonic.trim()) {
      Alert.alert('Error', 'Please enter your recovery phrase');
      return;
    }

    if (mnemonic.trim().split(' ').length !== 12) {
      Alert.alert('Error', 'Recovery phrase must be 12 words');
      return;
    }

    if (!pin || pin.length !== 4) {
      Alert.alert('Error', 'Please enter a 4-digit PIN');
      return;
    }

    if (pin !== confirmPin) {
      Alert.alert('Error', 'PINs do not match');
      return;
    }

    setLoading(true);
    
    try {
      // TODO: TO BE IMPLEMENTED, RESTORE FROM MNEMONICS
      const success = await restoreWallet(mnemonic.trim(), pin);
      
      if (success) {
        Alert.alert(
          'Wallet Restored',
          'Your wallet has been successfully restored!',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(tabs)'),
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to restore wallet. Please check your recovery phrase.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to restore wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <RefreshCw size={48} color={Colors.primary} />
          <Text style={styles.title}>Restore Wallet</Text>
          <Text style={styles.subtitle}>
            Enter your 12-word recovery phrase to restore your wallet
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Recovery Phrase</Text>
            <TextInput
              style={styles.mnemonicInput}
              placeholder="Enter your 12-word recovery phrase separated by spaces"
              value={mnemonic}
              onChangeText={setMnemonic}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.inputHelper}>
              Words: {mnemonic.trim().split(' ').filter(word => word.length > 0).length}/12
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Old PIN</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 4-digit PIN"
              value={pin}
              onChangeText={setPin}
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>New PIN</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm your PIN"
              value={confirmPin}
              onChangeText={setConfirmPin}
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
            />
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Security Information</Text>
          <Text style={styles.infoText}>
            • Your recovery phrase will be encrypted with your new PIN{'\n'}
            • Make sure you're in a private location{'\n'}
            • Never share your recovery phrase with anyone{'\n'}
            • This will overwrite any existing wallet on this device
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Restore Wallet"
            onPress={handleRestore}
            loading={loading}
            disabled={!mnemonic.trim() || !pin || !confirmPin}
            fullWidth
            size="large"
            style={styles.restoreButton}
          />
          
          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="outline"
            fullWidth
            style={styles.cancelButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  mnemonicInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.background,
    minHeight: 100,
  },
  inputHelper: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  infoCard: {
    margin: 20,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  buttonContainer: {
    padding: 20,
    paddingTop: 0,
  },
  restoreButton: {
    marginBottom: 12,
  },
  cancelButton: {
    marginBottom: 20,
  },
});