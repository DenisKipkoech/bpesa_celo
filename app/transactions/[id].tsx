import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import {
  Check,
  X,
  Clock,
  Copy,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  Share2,
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { formatCurrency, truncateAddress } from '@/utils/formatters';
import { useWalletStore } from '@/stores/wallet-store';

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'load' | 'withdraw';
  amount: number;
  recipient: string;
  recipientAddress?: string;
  sender?: string;
  senderAddress?: string;
  timestamp: number;
  date: string;
  hash?: string;
  status?: string;
}

export default function TransactionDetailsScreen() {
  const { country } = useWalletStore();
  const { transaction: txParam } = useLocalSearchParams<{ id: string; transaction?: string }>();
  const transaction = txParam ? (JSON.parse(txParam) as Transaction) : null;

  const [showFullDetails, setShowFullDetails] = useState(false);
  const [copiedField, setCopiedField] = useState('');

  const copyToClipboard = (text: string, field: string) => {
    Clipboard.setStringAsync(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  if (!transaction) {
    return (
      <View style={styles.centeredContainer}>
        <X color={Colors.error} size={64} />
        <Text style={styles.errorTitle}>Transaction Not Found</Text>
        <Text style={styles.errorText}>The requested transaction could not be found.</Text>
      </View>
    );
  }

  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'completed':
        return <Check size={16} color={Colors.success} />;
      case 'failed':
        return <X size={16} color={Colors.error} />;
      case 'pending':
        return <Clock size={16} color={Colors.warning} />;
      default:
        return null;
    }
  };

  const getAmountPrefix = () => {
    return ['send', 'withdraw'].includes(transaction.type) ? '- ' : '+ ';
  };

  const getAmountColor = () => {
    return ['send', 'withdraw'].includes(transaction.type) ? styles.amountRed : styles.amountGreen;
  };

  const DetailItem = ({ label, value, copyable }: { label: string; value: string; copyable?: boolean }) => (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <View style={styles.detailValueContainer}>
        <Text style={styles.detailValue}>{value}</Text>
        {copyable && (
          <TouchableOpacity onPress={() => copyToClipboard(value, label)}>
            {copiedField === label ? <Check size={16} color={Colors.success} /> : <Copy size={16} color={Colors.textSecondary} />}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.card}>
        {/* <Text style={styles.title}>Transaction Details</Text> */}
        <Text style={[styles.amount, getAmountColor()]}>
          {getAmountPrefix()}{formatCurrency(transaction.amount.toString(), country)}
        </Text>
        <Text style={styles.date}>{transaction.date}</Text>

        <DetailItem label="Reference" value={transaction.id} copyable />

        {transaction.type === 'send' && (
          <>
            <DetailItem label="Recipient" value={`${transaction.recipient}`} copyable />
            {/* {transaction.recipientAddress && (
              <DetailItem label="Recipient Address" value={truncateAddress(transaction.recipientAddress, 10)} copyable />
            )} */}
          </>
        )}

        {transaction.type === 'receive' && transaction.sender && (
          <>
            <DetailItem label="Sender" value={`${transaction.sender}`} copyable />
            {/* {transaction.senderAddress && (
              <DetailItem label="Sender Address" value={truncateAddress(transaction.senderAddress, 10)} copyable />
            )} */}
          </>
        )}

        {(transaction.type === 'load' || transaction.type === 'withdraw') && (
          <DetailItem label="Service" value={transaction.recipient} />
        )}

        {transaction.hash && (
          <>
            <TouchableOpacity onPress={() => setShowFullDetails(!showFullDetails)} style={styles.expandToggle}>
              <Text style={styles.detailLabel}>Transaction Hash</Text>
              {showFullDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </TouchableOpacity>
            {showFullDetails && (
              <DetailItem label="Transaction Hash" value={truncateAddress(transaction.hash, 15)} copyable />
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: 16,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.background,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    color: Colors.text,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  amount: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 12,
  },
  amountRed: {
    color: Colors.error,
  },
  amountGreen: {
    color: Colors.success,
  },
  date: {
    fontSize: 14,
    textAlign: 'center',
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  detailItem: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  expandToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
});
// 