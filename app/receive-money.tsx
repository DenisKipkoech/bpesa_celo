import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Share, Alert, ScrollView } from 'react-native';
import { Copy, Share2, QrCode } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { QRCodeGenerator } from '@/components/QRCodeGenerator';
import { useWalletStore } from '@/stores/wallet-store';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReceiveMoneyScreen() {
  const [showQR, setShowQR] = useState(true);
  const { phoneNumber, walletAddress } = useWalletStore();
  
  const qrData = JSON.stringify({
    type: 'bpesa_payment',
    phoneNumber: phoneNumber
  });

  const handleCopyPhoneNumber = async () => {
    await Clipboard.setStringAsync(phoneNumber!);
    Alert.alert('Copied', 'Number copied to clipboard');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Send me money on Bpesa using my phone number: ${phoneNumber}`,
        title: 'My Bpesa Details',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}  contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled">
        <Text style={styles.subtitle}>
          Share your details or QR code with the sender
        </Text>

        <View style={styles.phoneCard}>
          <Text style={styles.phoneLabel}>Your Bpesa Number</Text>
          <Text style={styles.phoneNumber}>{phoneNumber}</Text>
          <TouchableOpacity style={styles.copyButton} onPress={handleCopyPhoneNumber}>
            <Copy size={16} color={Colors.primary} />
            <Text style={styles.copyText}>Copy</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.qrSection}>
          <View style={styles.qrHeader}>
            <TouchableOpacity
              style={[styles.qrToggle, showQR && styles.activeQrToggle]}
              onPress={() => setShowQR(true)}
            >
              <QrCode size={16} color={showQR ? Colors.background : Colors.textSecondary} />
              <Text style={[
                styles.qrToggleText,
                showQR && styles.activeQrToggleText
              ]}>QR Code</Text>
            </TouchableOpacity>
          </View>

          {showQR && (
            <View style={styles.qrContainer}>
              <QRCodeGenerator 
                value={qrData}
                size={200}
                backgroundColor={Colors.background}
                color={Colors.text}
              />
              <Text style={styles.qrDescription}>
                Ask the sender to scan this QR code
              </Text>
            </View>
          )}
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Share2 size={20} color={Colors.primary} />
            <Text style={styles.actionButtonText}>Share Details</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How to receive money</Text>
          <Text style={styles.infoText}>
            1. Share your phone number or QR code with the sender{'\n'}
            2. They can send money using the Bpesa app{'\n'}
            3. You'll receive a notification when money arrives{'\n'}
            4. Money will be added to your Bpesa balance instantly
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  phoneCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  phoneLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  phoneNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  copyText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  qrSection: {
    marginBottom: 24,
  },
  qrHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: Colors.card,
  },
  activeQrToggle: {
    backgroundColor: Colors.primary,
  },
  qrToggleText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  activeQrToggleText: {
    color: Colors.background,
  },
  qrContainer: {
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
  },
  qrDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
  actionsContainer: {
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    paddingVertical: 16,
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
  },
  infoCard: {
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
});