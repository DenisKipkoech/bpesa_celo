import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Smartphone, MapPin, Building } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useWalletStore } from '@/stores/wallet-store';
import { getCkesBalance } from '@/utils/blockchain';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WithdrawMoneyScreen() {
  const router = useRouter();
  // const [balance, setBalance] = useState<number>(0);
  // const [balanceLoading, setBalanceLoading] = useState(true);
  const { walletAddress } = useWalletStore();

  // useEffect(() => {
  //   if (walletAddress) {
  //     setBalanceLoading(true);
  //     getCkesBalance(walletAddress)
  //       .then(balanceString => {
  //         setBalance(parseFloat(balanceString));
  //         setBalanceLoading(false);
  //       })
  //       .catch(error => {
  //         console.error('Error fetching balance:', error);
  //         setBalanceLoading(false);
  //       });
  //   }
  // }, [walletAddress]);
  const handleMpesaWithdraw = () => {
    router.push('/withdraw-agent');
  };

  const handleAgentWithdraw = () => {
    // Mock agent withdrawal
    console.log('Agent withdrawal not implemented yet');
  };

  const handleBankWithdraw = () => {
    // Mock bank withdrawal
    console.log('Bank withdrawal not implemented yet');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Withdraw Money</Text>
      <Text style={styles.subtitle}>
        Choose how you want to withdraw money from your Bpesa account
      </Text>
{/* 
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>KES {balanceLoading? 'Loading...' : balance}</Text>
      </View> */}

      <View style={styles.methodsContainer}>
        {/* <TouchableOpacity style={styles.methodCard} onPress={handleMpesaWithdraw}>
          <View style={[styles.methodIcon, { backgroundColor: '#00A651' }]}>
            <Smartphone size={32} color={Colors.background} />
          </View>
          <Text style={styles.methodTitle}>M-Pesa</Text>
          <Text style={styles.methodDescription}>
            Withdraw money directly to your M-Pesa account
          </Text>
          <View style={styles.methodBadge}>
            <Text style={styles.methodBadgeText}>Instant</Text>
          </View>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.methodCard} onPress={handleMpesaWithdraw}>
          <View style={styles.methodIcon}>
            <MapPin size={32} color={Colors.primary} />
          </View>
          <Text style={styles.methodTitle}>Bpesa Agent</Text>
          <Text style={styles.methodDescription}>
            Withdraw cash at any Bpesa agent location
          </Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.methodCard} onPress={handleBankWithdraw}>
          <View style={styles.methodIcon}>
            <Building size={32} color={Colors.primary} />
          </View>
          <Text style={styles.methodTitle}>Bank Account</Text>
          <Text style={styles.methodDescription}>
            Transfer money to your bank account
          </Text>
        </TouchableOpacity> */}
      </View>

      {/* <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Withdrawal Fees</Text>
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>M-Pesa (up to KES 5,000)</Text>
          <Text style={styles.feeValue}>KES 10</Text>
        </View>
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>M-Pesa (above KES 5,000)</Text>
          <Text style={styles.feeValue}>KES 25</Text>
        </View>
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Bpesa Agent</Text>
          <Text style={styles.feeValue}>KES 5</Text>
        </View>
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Bank Transfer</Text>
          <Text style={styles.feeValue}>KES 50</Text>
        </View>
      </View> */}
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    paddingBottom: 40
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
    marginBottom: 24,
  },
  balanceCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 32,
  },
  balanceLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  methodsContainer: {
    marginBottom: 32,
  },
  methodCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    position: 'relative',
  },
  methodIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  methodTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  methodDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  methodBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.success,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  methodBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.background,
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
    flex: 1,
  },
  feeValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
});