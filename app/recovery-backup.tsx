import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, Share } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Copy, Download, Cloud, Shield, Key } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { useWalletStore } from '@/stores/wallet-store';
import * as Clipboard from 'expo-clipboard';

export default function RecoveryBackupScreen() {
  const router = useRouter();
  const { mnemonic, address } = useLocalSearchParams<{ mnemonic: string; address: string }>();
  const { backupRecoveryKeys } = useWalletStore();
  const [backupMethod, setBackupMethod] = useState<'none' | 'local' | 'cloud'>('none');

  const recoveryWords = mnemonic?.split(' ') || [];

  const handleCopyRecoveryCode = async () => {
    await Clipboard.setStringAsync(mnemonic);
    Alert.alert('Copied', 'Secret recovery code copied to clipboard');
  };

  const handleLocalBackup = async () => {
    try {
      await Share.share({
        message: `Bpesa Account Recovery Code (Keep Safe!):\n\n${mnemonic}\n\nAccount ID: ${address}\n\nIMPORTANT: This is your only way to recover your account. Never share with anyone.`,
        title: 'Bpesa Account Recovery Code',
      });
      setBackupMethod('local');
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleContinue = () => {
    if (backupMethod === 'none') {
      Alert.alert(
        'Backup Required',
        'Please save your recovery code before continuing. Without it, you cannot access your account if you lose your device or forget your password.',
        [
          { text: 'OK', style: 'default' },
        ]
      );
      return;
    }

    backupRecoveryKeys();
    router.replace('/(tabs)');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Key size={40} color={Colors.primary} />
        <Text style={styles.title}>Save Your Recovery Code</Text>
        <Text style={styles.subtitle}>
          This special code is your master key to your account. Think of it like a backup password that can restore everything.
        </Text>
      </View>

      <View style={styles.recoveryContainer}>
        <View style={styles.wordsGrid}>
          {recoveryWords.map((word, index) => (
            <View key={index} style={styles.wordCard}>
              <Text style={styles.wordNumber}>{index + 1}</Text>
              <Text style={styles.wordText}>{word}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.copyButton} onPress={handleCopyRecoveryCode}>
          <Copy size={14} color={Colors.primary} />
          <Text style={styles.copyText}>Copy</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.backupOption,
          backupMethod === 'local' && styles.selectedBackupOption
        ]}
        onPress={handleLocalBackup}
      >
        <Download size={20} color={backupMethod === 'local' ? Colors.primary : Colors.textSecondary} />
        <Text style={[
          styles.backupOptionTitle,
          backupMethod === 'local' && styles.selectedBackupOptionTitle
        ]}>
          Save to My Device
        </Text>
        {backupMethod === 'local' && (
          <View style={styles.checkmark}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.tipCard}>
        <Text style={styles.tipText}>
          <Text style={styles.tipEmoji}>💡 </Text>
          This is your only way to recover your account. Keep it private and store it somewhere safe.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="I've Saved My Recovery Code"
          onPress={handleContinue}
          fullWidth
          size="large"
        />
      </View>
    </ScrollView>
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
    fontSize: 22,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 12,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  recoveryContainer: {
    margin: 20,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    position: 'relative',
  },
  wordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  wordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 6,
    padding: 8,
    minWidth: '30%',
  },
  wordNumber: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginRight: 6,
    minWidth: 14,
    fontWeight: '500',
  },
  wordText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  copyButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  copyText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
  },
  backupOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 12,
    margin: 20,
    marginTop: 0,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border || 'transparent',
  },
  selectedBackupOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  backupOptionTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
    marginLeft: 12,
    flex: 1,
  },
  selectedBackupOptionTitle: {
    color: Colors.primary,
    fontWeight: '600',
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: Colors.background,
    fontSize: 11,
    fontWeight: 'bold',
  },
  tipCard: {
    margin: 20,
    marginTop: 0,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  tipText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  tipEmoji: {
    fontSize: 14,
  },
  buttonContainer: {
    padding: 20,
    paddingTop: 8,
  },
});