import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Colors } from '@/constants/colors';
import { Button } from '@/components/Button';

export default function QRScannerScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    console.log("QR COD"),
    console.log(data)
    if (scanned) return;
    
    setScanned(true);
    
    try {
      const qrData = JSON.parse(data);
      
      if (qrData.type === 'bpesa_payment' && qrData.phoneNumber) {
        router.replace({
          pathname: '/send-amount',
          params: { 
            recipient: qrData.phoneNumber,
            inputMethod: 'qr'
          }
        });
      } else {
        Alert.alert(
          'Invalid QR Code',
          'This QR code is not a valid Bpesa payment code.',
          [
            {
              text: 'Scan Again',
              onPress: () => setScanned(false),
            },
            {
              text: 'Cancel',
              onPress: () => router.back(),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        'Invalid QR Code',
        'Unable to read this QR code. Please try again.',
        [
          {
            text: 'Scan Again',
            onPress: () => setScanned(false),
          },
          {
            text: 'Cancel',
            onPress: () => router.back(),
          },
        ]
      );
    }
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need access to your camera to scan QR codes for payments.
          </Text>
          <Button
            title="Grant Permission"
            onPress={requestPermission}
            style={styles.permissionButton}
          />
        </View>
      </View>
    );
  }

  // For web, show a fallback message
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.webFallback}>
          <Text style={styles.webFallbackTitle}>QR Scanner Not Available</Text>
          <Text style={styles.webFallbackText}>
            QR code scanning is not available on web. Please use the mobile app or enter the recipient details manually.
          </Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={styles.webFallbackButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
  <CameraView
    style={StyleSheet.absoluteFillObject}
    facing="back"
    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
    barcodeScannerSettings={{
      barcodeTypes: ['qr'],
    }}
  />
  <View style={styles.overlay}>
    <View style={styles.scanArea}>
      <View style={styles.scanFrame} />
    </View>
    <View style={styles.instructionContainer}>
      <Text style={styles.instructionText}>
        Position the QR code within the frame to scan
      </Text>
    </View>
  </View>
</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    ...StyleSheet.absoluteFillObject,
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  instructionContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
  },
  instructionText: {
    color: Colors.background,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  permissionButton: {
    minWidth: 200,
  },
  webFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webFallbackTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  webFallbackText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  webFallbackButton: {
    minWidth: 200,
  },
});