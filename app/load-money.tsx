import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Smartphone, CreditCard, Building } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

export default function LoadMoneyScreen() {
  const router = useRouter();

  const handleMpesaLoad = () => {
    router.push('/load-mpesa');
  };

  const handleBankLoad = () => {
    // Mock bank loading
    console.log('Bank loading not implemented yet');
  };

  const handleCardLoad = () => {
    // Mock card loading
    console.log('Card loading not implemented yet');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Load Money</Text>
      <Text style={styles.subtitle}>
        Choose how you want to add money to your Bpesa account
      </Text>

      <View style={styles.methodsContainer}>
        <TouchableOpacity style={styles.methodCard} onPress={handleMpesaLoad}>
          <View style={[styles.methodIcon, { backgroundColor: '#00A651' }]}>
            <Smartphone size={32} color={Colors.background} />
          </View>
          <Text style={styles.methodTitle}>M-Pesa</Text>
          <Text style={styles.methodDescription}>
            Load money directly from your M-Pesa account
          </Text>
          <View style={styles.methodBadge}>
            <Text style={styles.methodBadgeText}>Recommended</Text>
          </View>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.methodCard} onPress={handleBankLoad}>
          <View style={styles.methodIcon}>
            <Building size={32} color={Colors.primary} />
          </View>
          <Text style={styles.methodTitle}>Bank Transfer</Text>
          <Text style={styles.methodDescription}>
            Transfer money from your bank account
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.methodCard} onPress={handleCardLoad}>
          <View style={styles.methodIcon}>
            <CreditCard size={32} color={Colors.primary} />
          </View>
          <Text style={styles.methodTitle}>Debit/Credit Card</Text>
          <Text style={styles.methodDescription}>
            Use your debit or credit card to load money
          </Text>
        </TouchableOpacity> */}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Why load money?</Text>
        <Text style={styles.infoText}>
          • Send money to friends and family{'\n'}
          • Pay for goods and services{'\n'}
          • Earn rewards on transactions{'\n'}
          • Access to exclusive Bpesa features
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});