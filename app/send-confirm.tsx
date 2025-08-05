import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { formatCurrency } from '@/utils/formatters';
import { useWalletStore } from '@/stores/wallet-store';
import { sendTransaction } from '@/utils/api';
import { getCkesBalance, getTransactionCount, kestoWei } from '@/utils/blockchain';
import { getCurrentNetwork } from '@/constants/networks';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function SendConfirmScreen() {
  const router = useRouter();
  const { recipient, inputMethod, amount, note } = useLocalSearchParams<{ 
    recipient: string; 
    inputMethod: string; 
    amount: string;
    note?: string;
  }>();
  const [balance, setBalance] = useState<number>(0);
  const [balanceLoading, setBalanceLoading] = useState(true);
  
  const { isUnlocked, walletAddress, phoneNumber,country } = useWalletStore();
  const [loading, setLoading] = useState(false);

  const numericAmount = parseFloat(amount);
  const fee = 5; // Mock transaction fee in KES
  const total = numericAmount + fee;
  
  // Check if user has sufficient balance
  const hasSufficientBalance = balance >= total;

  useEffect(() => {
    if (walletAddress) {
      setBalanceLoading(true);
      getCkesBalance(walletAddress)
        .then(balanceString => {
          setBalance(parseFloat(balanceString));
          setBalanceLoading(false);
        })
        .catch(error => {
          console.error('Error fetching balance:', error);
          setBalanceLoading(false);
        });
    }
  }, [walletAddress]);

  const handleConfirm = () => {
    if (!isUnlocked) {
      // Redirect to PIN verification with transaction data
      const transactionData = {
        type: 'send',
        recipient,
        amount: numericAmount,
        fee,
        note,
        timestamp: Date.now(),
      };

      router.push({
        pathname: '/pin-verify',
        params: { 
          returnTo: '/transaction-progress',
          transactionData: JSON.stringify(transactionData)
        }
      });
    } else {
      // Wallet is already unlocked, proceed directly
      proceedWithTransaction();
    }
  };

  const proceedWithTransaction = async () => {
    if (!walletAddress) {
      Alert.alert('Error', 'Wallet not found');
      return;
    }

    // Double-check balance before proceeding
    if (balance < total) {
      Alert.alert('Insufficient Balance', 'You do not have enough funds to cover the total amount including network fee.');
      return;
    }

    setLoading(true);
    
    try {
      const network = getCurrentNetwork();
      const nonce = await getTransactionCount(walletAddress);
      const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const amountInWei = kestoWei(total);
      console.log(network)
      console.log(nonce)

      // Create EIP-2612 permit data
      const permitData = {
        owner: walletAddress,
        spender: network.contractAddresses.bpesaPayments,
        value: amountInWei,
        nonce: nonce.toString(),
        deadline: deadline.toString(),
      };

      // This would normally require PIN, but since we're already unlocked, we'll prompt for it
      Alert.alert(
        'Confirm Transaction',
        'Please enter your PIN',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => setLoading(false) },
          {
            text: 'Continue',
            onPress: () => {
              router.push({
                pathname: '/pin-verify',
                params: { 
                  returnTo: '/transaction-progress',
                  transactionData: JSON.stringify({
                    type: 'send',
                    recipient,
                    amount: numericAmount,
                    fee,
                    note,
                    permitData,
                  })
                }
              });
              setLoading(false);
            },
          },
        ]
      );
    } catch (error) {
      console.error('Transaction preparation failed:', error);
      Alert.alert('Error', 'Failed to prepare transaction');
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Transaction Summary</Text>
        
        <View style={styles.transactionFlow}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>You</Text>
            </View>
            <Text style={styles.userLabel}>Your Account</Text>
            <Text style={styles.phoneNumber}>{phoneNumber}</Text>
          </View>
          
          <View style={styles.arrowContainer}>
            <ArrowRight size={24} color={Colors.primary} />
          </View>
          
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{recipient.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={styles.userLabel}>Recipient</Text>
            <Text style={styles.phoneNumber}>{recipient}</Text>
          </View>
        </View>

        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Amount</Text>
          <Text style={styles.amount}>{formatCurrency(numericAmount.toString(),country)}</Text>
        </View>

        {/* {note && (
          <View style={styles.noteContainer}>
            <Text style={styles.noteLabel}>Note</Text>
            <Text style={styles.noteText}>{note}</Text>
          </View>
        )} */}
      </View>

      <View style={styles.feeCard}>
        <Text style={styles.feeTitle}>Transaction Details</Text>
        
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Amount</Text>
          <Text style={styles.feeValue}>{formatCurrency(numericAmount.toString(),country)}</Text>
        </View>
        
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Transaction Fee</Text>
          <Text style={styles.feeValue}>{formatCurrency(fee.toString(),country)}</Text>
        </View>
        
        <View style={[styles.feeRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCurrency(total.toString(),country)}</Text>
        </View>

        {/* Balance Display */}
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Your Balance</Text>
          <Text style={[
            styles.feeValue, 
            !hasSufficientBalance && styles.insufficientBalance
          ]}>
            {balanceLoading ? 'Loading...' : formatCurrency(balance.toString(),country)}
          </Text>
        </View>
      </View>

      {/* Insufficient Balance Warning */}
      {!hasSufficientBalance && !balanceLoading && (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>
            ⚠️ Insufficient Balance
          </Text>
          <Text style={styles.errorSubtext}>
            You need {formatCurrency((total - balance).toString(),country)} more to complete this transaction.
          </Text>
        </View>
      )}

      <View style={styles.warningCard}>
        <Text style={styles.warningText}>
          Please verify all details before confirming.
        </Text>
      </View>

      <Button
        title={
          !hasSufficientBalance && !balanceLoading
            ? 'Insufficient Balance'
            : `Send ${formatCurrency(total.toString(),country)}`
        }
        onPress={handleConfirm}
        loading={loading || balanceLoading}
        fullWidth
        size="large"
        style={styles.confirmButton}
        disabled={
          numericAmount <= 0 || 
          isNaN(numericAmount) || 
          !hasSufficientBalance || 
          balanceLoading
        }
      />
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  summaryCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  transactionFlow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  userInfo: {
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.background,
  },
  userLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  phoneNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  arrowContainer: {
    marginHorizontal: 16,
  },
  amountContainer: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  amountLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  amount: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
  },
  noteContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  noteLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  noteText: {
    fontSize: 16,
    color: Colors.text,
  },
  feeCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  feeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  feeLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  feeValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  insufficientBalance: {
    color: '#DC3545',
  },
  totalRow: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  errorCard: {
    backgroundColor: '#F8D7DA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#721C24',
    textAlign: 'center',
    marginBottom: 4,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#721C24',
    textAlign: 'center',
  },
  warningCard: {
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  warningText: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
  },
  confirmButton: {
    marginBottom: 20,
  },
});