import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { ArrowDownLeft, ArrowUpRight, Wallet } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { formatCurrency } from '@/utils/formatters';
import { useWalletStore } from '@/stores/wallet-store';

export type TransactionType = 
  | 'send' 
  | 'receive' 
  | 'load' 
  | 'withdraw'
  | 'deposit'
  | 'stake'
  | 'unstake'
  | 'claim';

interface TransactionCardProps {
  id: string;
  type: TransactionType;
  amount: number;
  recipient: string;
  date: string;
  onPress: () => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  type,
  amount,
  recipient,
  date,
  onPress,
}) => {
  const { country } = useWalletStore();
 const getIcon = () => {
  switch (type) {
    case 'send':
      return <ArrowUpRight size={24} color={Colors.error} />;
    case 'receive':
      return <ArrowDownLeft size={24} color={Colors.success} />;
    case 'load':
    case 'deposit':
      return <Wallet size={24} color={Colors.info} />;
    case 'withdraw':
    case 'stake':
    case 'unstake':
    case 'claim':
      return <Wallet size={24} color={Colors.warning} />;
    default:
      return <Wallet size={24} color={Colors.primary} />;
  }
};

const getTitle = () => {
  switch (type) {
    case 'send':
      return 'Sent';
    case 'receive':
      return 'Received';
    case 'load':
    case 'deposit':
      return 'Loaded';
    case 'withdraw':
      return 'Withdrawn';
    case 'stake':
      return 'Staked';
    case 'unstake':
      return 'Unstaked';
    case 'claim':
      return 'Claimed Commission';
    default:
      return 'Transaction';
  }
};

const getAmountColor = () => {
  switch (type) {
    case 'send':
    case 'withdraw':
    case 'stake':
      return Colors.error;
    case 'receive':
    case 'load':
    case 'deposit':
    case 'claim':
    case 'unstake':
      return Colors.success;
    default:
      return Colors.text;
  }
};

const getAmountPrefix = () => {
  switch (type) {
    case 'send':
    case 'withdraw':
    case 'stake':
      return '- ';
    case 'receive':
    case 'load':
    case 'deposit':
    case 'unstake':
    case 'claim':
      return '+ ';
    default:
      return '';
  }
};


  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>{getIcon()}</View>
      <View style={styles.contentContainer}>
        <View style={styles.row}>
          <Text style={styles.title}>{getTitle()}</Text>
          <Text
            style={[styles.amount, { color: getAmountColor() }]}
          >
            {getAmountPrefix()}{formatCurrency(amount.toString(),country)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.recipient} numberOfLines={1}>
            {recipient}
          </Text>
          <Text style={styles.date}>{date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.background,
    borderRadius: 12,
    marginBottom: 12,
    ...{
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  recipient: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
    marginRight: 8,
  },
  date: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});