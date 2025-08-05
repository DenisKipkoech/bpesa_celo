import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { formatCurrency, truncateAddress } from '@/utils/formatters';
import { RefreshCcw } from 'lucide-react-native';
import CurrencySwitcher from './CurrencySwitcher';

interface BalanceCardProps {
  balance: string;
  phoneNumber: string;
  walletAddress: string;
  networkName: string;
  country: string;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  balance,
  phoneNumber,
  walletAddress,
  networkName,
  country,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <LinearGradient
      colors={[Colors.primary, Colors.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.balanceLabel}>Current:`</Text>
        <Text style={styles.balanceAmount}>{formatCurrency(balance,country)}</Text>
        
        <View style={styles.divider} />
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Account Number</Text>
          <Text style={styles.phoneNumber}>{phoneNumber}</Text>
        </View>
        
        {/* <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Wallet Address</Text>
          <Text style={styles.walletAddress}>{truncateAddress(walletAddress, 6)}</Text>
        </View> */}
        
        {/* <View style={styles.networkBadge}>
          <Text style={styles.networkText}>{networkName}</Text>
        </View> */}
        {/* Refresh Button */}
        {/* <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          {isRefreshing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <RefreshCcw size={16} color="#fff" />
          )}
        </TouchableOpacity> */}

        <CurrencySwitcher />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginVertical: 16,
  },
  content: {
    padding: 24,
  },
   refreshButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primaryLight,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.background,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.primaryLight,
    marginBottom: 2,
  },
  phoneNumber: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.background,
  },
  walletAddress: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.background,
    fontFamily: 'monospace',
  },
  networkBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  networkText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.background,
  },
});