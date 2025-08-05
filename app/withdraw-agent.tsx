import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Smartphone } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { formatCurrency, getCurrencySymbol } from '@/utils/formatters';
import { useWalletStore } from '@/stores/wallet-store';
import { getCkesBalance, getTransactionCount, kestoWei } from '@/utils/blockchain';
import { getCurrentNetwork } from '@/constants/networks';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function WithdrawAgentScreen() {
  const router = useRouter();
  const { phoneNumber, isUnlocked,walletAddress,country } = useWalletStore();
  const [amount, setAmount] = useState('');
  const [agentNumber, setAgentNumber] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [availableBalance, setBalance] = useState<number>(0);
  const [balanceLoading, setBalanceLoading] = useState(true);

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

  const quickAmounts = [500, 1000, 2000, 5000];
  // const availableBalance = 10500;

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };

  const calculateFee = (amount: number) => {
    return 5
  };

  const handleWithdrawMoney = async () => {
    const numericAmount = parseFloat(amount);
    
    if (!amount || numericAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (numericAmount > availableBalance) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    if (!agentNumber.trim()) {
      Alert.alert('Error', 'Please enter your M-Pesa number');
      return;
    }

    const fee = calculateFee(numericAmount);
    const total = numericAmount + fee;

    if (!isUnlocked) {
      // Redirect to PIN verification
      const transactionData = {
        type: 'withdraw',
        amount: numericAmount,
        recipient: agentNumber.trim(),
        fee,
        note:"",
        timestamp: Date.now(),
      };

      router.push({
        pathname: '/pin-verify',
        params: { 
          returnTo: '/transaction-progress',
          transactionData: JSON.stringify(transactionData)
        }
      });
   
    }else{
    processWithdrawal(numericAmount,fee,total, agentNumber.trim())
    }

//     Alert.alert(
//       'Confirm Withdrawal',
//       `Withdraw ${formatCurrency(numericAmount.toString())} to ${agentNumber}?

// Transaction fee: ${formatCurrency(fee.toString())}
// Total deducted: ${formatCurrency(total.toString())}`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Confirm',
//           onPress: () => processWithdrawal(numericAmount, fee),
//         },
//       ]
//     );
  };

  const processWithdrawal = async (amount: number, fee: number,total: number,recipient: string) => {

    if (!walletAddress) {
          Alert.alert('Error', 'Wallet not found');
          return;
        }

        if (availableBalance < total) {
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
                          type: 'withdraw',
                          recipient,
                          amount,
                          fee,
                          note:"",
                          permitData,
                        })
                      }
                    });
                    setLoading(false);
                  },
                },
              ]
            );
      

      // const response = await withdrawToMpesa({
      //   phoneNumber: phoneNumber || '',
      //   amount: amount.toString(),
      //   agentNumber: agentNumber.trim(),
      //   signature: 'mock_signature', // In real app, this would be generated
      // });

      // if (response.success) {
      //   Alert.alert(
      //     'Withdrawal Successful!',
      //     `${formatCurrency(amount.toString())} has been sent to the agent. Agent should give you ${formatCurrency(amount.toString())} cash `,
      //     [
      //       {
      //         text: 'OK',
      //         onPress: () => router.replace('/(tabs)'),
      //       },
      //     ]
      //   );
      // } else {
      //   Alert.alert('Error', response.error || 'Withdrawal failed');
      // }
    } catch (error) {
      console.error('Withdrawal failed:', error);
      Alert.alert('Error', 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const numericAmount = parseFloat(amount) || 0;
  const fee = numericAmount > 0 ? calculateFee(numericAmount) : 0;
  const total = numericAmount + fee;

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.agentIcon}>
          <Smartphone size={32} color={Colors.background} />
        </View>
        <Text style={styles.title}>Withdraw at Agent</Text>
        {/* <Text style={styles.subtitle}>
          Enter the amount you want to withdraw 
        </Text> */}
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>{formatCurrency(availableBalance.toString(),country)}</Text>
      </View>

      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Amount to Withdraw</Text>
        <View style={styles.amountInputContainer}>
          <Text style={styles.currencySymbol}>{getCurrencySymbol(country)}</Text>
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
            {formatCurrency(numericAmount.toString(),country)}
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

      <View style={styles.agentNumberContainer}>
        <Text style={styles.agentNumberLabel}>Agent Number</Text>
        <TextInput
          style={styles.agentNumberInput}
          placeholder="Enter Agent number (e.g., 234127)"
          value={agentNumber}
          onChangeText={setAgentNumber}
          keyboardType="phone-pad"
          maxLength={6}
        />
      </View>

      {numericAmount > 0 && (
        <View style={styles.feeCard}>
          <Text style={styles.feeTitle}>Transaction Summary</Text>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Amount</Text>
            <Text style={styles.feeValue}>{formatCurrency(numericAmount.toString(),country)}</Text>
          </View>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Transaction Fee</Text>
            <Text style={styles.feeValue}>{formatCurrency(fee.toString(),country)}</Text>
          </View>
          <View style={[styles.feeRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Deducted</Text>
            <Text style={styles.totalValue}>{formatCurrency(total.toString(),country)}</Text>
          </View>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title={loading ? 'Processing...' : `Withdraw ${numericAmount > 0 ? formatCurrency(numericAmount.toString(),country) : 'Money'}`}
          onPress={handleWithdrawMoney}
          disabled={!amount || parseFloat(amount) <= 0 || !agentNumber.trim() || parseFloat(amount) > availableBalance}
          loading={loading}
          fullWidth
          size="large"
          style={styles.withdrawButton}
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
  agentIcon: {
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
  balanceCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  amountContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
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
    marginBottom: 24,
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
  agentNumberContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  agentNumberLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 12,
  },
  agentNumberInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  feeCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
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
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  withdrawButton: {
    marginBottom: 20,
  },
});