import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Vibration, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';

interface PinInputProps {
  onComplete: (pin: string) => void;
  loading?: boolean;
}

export const PinInput: React.FC<PinInputProps> = ({ onComplete, loading = false }) => {
const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const didCompleteRef = useRef(false); // ✅ prevents duplicate onComplete

  useEffect(() => {
    if (pin.length === 4 && !didCompleteRef.current) {
      didCompleteRef.current = true;
      onComplete(pin);
    }
  }, [pin, onComplete]);

  useEffect(() => {
    // Reset completion guard when PIN is cleared or incomplete
    if (pin.length < 4) {
      didCompleteRef.current = false;
    }
  }, [pin]);
  
  const handleNumberPress = (number: string) => {
    if (loading || pin.length >= 4) return;
    
    // Haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setPin(prev => prev + number);
  };

  const handleBackspace = () => {
    if (loading) return;
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (loading) return;
    setPin('');
  };

  const renderPinDots = () => {
    return (
      <View style={styles.pinDotsContainer}>
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={[
              styles.pinDot,
              index < pin.length && styles.pinDotFilled,
            ]}
          >
            {showPin && index < pin.length && (
              <Text style={styles.pinDigit}>{pin[index]}</Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderKeypad = () => {
    const numbers = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['', '0', '⌫'],
    ];

    return (
      <View style={styles.keypad}>
        {numbers.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keypadRow}>
            {row.map((key, keyIndex) => {
              if (key === '') {
                return <View key={keyIndex} style={styles.keypadButton} />;
              }
              
              if (key === '⌫') {
                return (
                  <TouchableOpacity
                    key={keyIndex}
                    style={[styles.keypadButton, styles.backspaceButton]}
                    onPress={handleBackspace}
                    disabled={loading}
                  >
                    <Text style={styles.backspaceText}>⌫</Text>
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  key={keyIndex}
                  style={styles.keypadButton}
                  onPress={() => handleNumberPress(key)}
                  disabled={loading}
                >
                  <Text style={styles.keypadButtonText}>{key}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderPinDots()}
      
      <TouchableOpacity
        style={styles.showPinButton}
        onPress={() => setShowPin(!showPin)}
      >
        <Text style={styles.showPinText}>
          {showPin ? 'Hide PIN' : 'Show PIN'}
        </Text>
      </TouchableOpacity>

      {renderKeypad()}

      {pin.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  pinDotsContainer: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    marginHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinDotFilled: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  pinDigit: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.background,
  },
  showPinButton: {
    marginBottom: 32,
  },
  showPinText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  keypad: {
    width: '100%',
    maxWidth: 300,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  keypadButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadButtonText: {
    fontSize: 24,
    fontWeight: '500',
    color: Colors.text,
  },
  backspaceButton: {
    backgroundColor: Colors.error,
  },
  backspaceText: {
    fontSize: 20,
    color: Colors.background,
  },
  clearButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  clearButtonText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});