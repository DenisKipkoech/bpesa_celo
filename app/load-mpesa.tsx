import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Smartphone } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { formatCurrency } from '@/utils/formatters';
import { loadFromMpesa } from '@/utils/api';
import { useWalletStore } from '@/stores/wallet-store';

export default function LoadMpesaScreen() {
  const router = useRouter();
  const { phoneNumber } = useWalletStore();
  const [amount, setAmount] = useState('');
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const quickAmounts = [500, 1000, 2000, 5000, 10000];

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };

  const handleLoadMoney = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!mpesaNumber.trim()) {
      Alert.alert('Error', 'Please enter your M-Pesa number');
      return;
    }

    setLoading(true);

    try {
      // Call the load API
      const response = await loadFromMpesa({
        phoneNumber: phoneNumber || '',
        amount: parseFloat(amount).toString(),
        mpesaNumber: mpesaNumber.trim(),
      });

      if (response.success) {
        Alert.alert(
          'Load Successful!',
          `${formatCurrency(parseFloat(amount))} has been loaded to your Bpesa account from M-Pesa.`,
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(tabs)'),
            },
          ]
        );
      } else {
        Alert.alert('Error', response.error || 'Failed to load money');
      }
    } catch (error) {
      console.error('Load failed:', error);
      Alert.alert('Error', 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const numericAmount = parseFloat(amount) || 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.mpesaIcon}>
          <Smartphone size={32} color={Colors.background} />
        </View>
        <Text style={styles.title}>Load from M-Pesa</Text>
        <Text style={styles.subtitle}>
          Enter the amount you want to load from your M-Pesa account
        </Text>
      </View>

      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Amount to Load</Text>
        <View style={styles.amountInputContainer}>
          <Text style={styles.currencySymbol}>KES</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            autoFocus
          />
        </View>
        {numericAmount > 0 && (
          <Text style={styles.amountPreview}>
            {formatCurrency(numericAmount)}
          </Text>
        )}
      </View>

      <View style={styles.quickAmountsContainer}>
        <Text style={styles.quickAmountsLabel}>Quick amounts</Text>
        <View style={styles.quickAmountsGrid}>
          {quickAmounts.map((quickAmount) => (
            <TouchableOpacity
              key={quickAmount}
              style={[
                styles.quickAmountButton,
                amount === quickAmount.toString() && styles.activeQuickAmount
              ]}
              onPress={() => handleQuickAmount(quickAmount)}
            >
              <Text style={[
                styles.quickAmountText,
                amount === quickAmount.toString() && styles.activeQuickAmountText
              ]}>
                {quickAmount.toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.mpesaNumberContainer}>
        <Text style={styles.mpesaNumberLabel}>M-Pesa Number</Text>
        <TextInput
          style={styles.mpesaNumberInput}
          placeholder="Enter your M-Pesa number (e.g., 0712345678)"
          value={mpesaNumber}
          onChangeText={setMpesaNumber}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.flowContainer}>
        <Text style={styles.flowTitle}>How it works</Text>
        <View style={styles.flowStep}>
          <View style={styles.flowStepNumber}>
            <Text style={styles.flowStepNumberText}>1</Text>
          </View>
          <Text style={styles.flowStepText}>Enter amount and M-Pesa number</Text>
        </View>
        <View style={styles.flowStep}>
          <View style={styles.flowStepNumber}>
            <Text style={styles.flowStepNumberText}>2</Text>
          </View>
          <Text style={styles.flowStepText}>Receive STK push on your phone</Text>
        </View>
        <View style={styles.flowStep}>
          <View style={styles.flowStepNumber}>
            <Text style={styles.flowStepNumberText}>3</Text>
          </View>
          <Text style={styles.flowStepText}>Enter M-Pesa PIN to confirm</Text>
        </View>
        <View style={styles.flowStep}>
          <View style={styles.flowStepNumber}>
            <Text style={styles.flowStepNumberText}>4</Text>
          </View>
          <Text style={styles.flowStepText}>Money added to Bpesa account</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={loading ? 'Processing...' : `Load ${numericAmount > 0 ? formatCurrency(numericAmount) : 'Money'}`}
          onPress={handleLoadMoney}
          disabled={!amount || parseFloat(amount) <= 0 || !mpesaNumber.trim()}
          loading={loading}
          fullWidth
          size="large"
          style={styles.loadButton}
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
  mpesaIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#00A651',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  amountContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  amountLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: '600',
    color: Colors.text,
    marginRight: 8,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    minWidth: 100,
  },
  amountPreview: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  quickAmountsContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  quickAmountsLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 16,
  },
  quickAmountsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAmountButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeQuickAmount: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  activeQuickAmountText: {
    color: Colors.background,
  },
  mpesaNumberContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  mpesaNumberLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 12,
  },
  mpesaNumberInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  flowContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 32,
  },
  flowTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  flowStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  flowStepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  flowStepNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.background,
  },
  flowStepText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  loadButton: {
    marginBottom: 20,
  },
});