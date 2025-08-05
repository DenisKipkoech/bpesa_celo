import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

// 3rd-party navigation and hooks
import { useRouter, useLocalSearchParams } from "expo-router";

// Project modules
import { Colors } from "@/constants/colors";
import { Button } from "@/components/Button";
import { formatCurrency, getCurrencySymbol } from "@/utils/formatters";
import { getCkesBalance } from "@/utils/blockchain";
import { useWalletStore } from "@/stores/wallet-store";
import { SafeAreaView } from 'react-native-safe-area-context';


export default function SendAmountScreen() {
  const router = useRouter();
  const { recipient, inputMethod } = useLocalSearchParams<{
    recipient: string;
    inputMethod: string;
  }>();

  const [balance, setBalance] = useState<number>(0);
  const { walletAddress, phoneNumber,country } = useWalletStore();

  useEffect(() => {
    if (walletAddress) {
      getCkesBalance(walletAddress)
        .then((balanceString) => {
          const numericBalance = parseFloat(balanceString);
          setBalance(numericBalance);
        })
        .catch(console.error);
    }
  }, [walletAddress]);

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const numericAmount = parseFloat(amount) || 0;

  const quickAmounts = [100, 500, 1000, 2000, 5000];

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };

  const handleContinue = () => {
    if (!amount || numericAmount <= 0 || numericAmount > balance) {
      return;
    }

    router.push({
      pathname: "/send-confirm",
      params: {
        recipient,
        inputMethod,
        amount: numericAmount.toString(),
        note,
      },
    });
  };

  const isAmountInvalid =
    !amount || numericAmount <= 0 || numericAmount > balance;

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <ScrollView style={styles.container}>
      <View style={styles.recipientCard}>
        <Text style={styles.recipientLabel}>Sending to</Text>
        <Text style={styles.recipientValue}>{recipient}</Text>
      </View>

      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Amount</Text>
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
          {quickAmounts.map((quickAmount) => {
            const isDisabled = quickAmount > balance;
            const isSelected = amount === quickAmount.toString();

            return (
              <TouchableOpacity
                key={quickAmount}
                disabled={isDisabled}
                style={[
                  styles.quickAmountButton,
                  isSelected && styles.activeQuickAmount,
                  isDisabled && styles.disabledQuickAmount,
                ]}
                onPress={() => handleQuickAmount(quickAmount)}
              >
                <Text
                  style={[
                    styles.quickAmountText,
                    isSelected && styles.activeQuickAmountText,
                    isDisabled && styles.disabledQuickAmountText,
                  ]}
                >
                  {quickAmount.toLocaleString()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* <View style={styles.noteContainer}>
        <Text style={styles.noteLabel}>Note (optional)</Text>
        <TextInput
          style={styles.noteInput}
          placeholder="Add a note for this transaction"
          value={note}
          onChangeText={setNote}
          multiline
          maxLength={100}
        />
      </View> */}

      <Button
        title="Continue"
        onPress={handleContinue}
        disabled={isAmountInvalid}
        fullWidth
        style={styles.continueButton}
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
  recipientCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  recipientLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  disabledQuickAmount: {
    opacity: 0.4,
  },

  disabledQuickAmountText: {
    color: Colors.textSecondary,
  },

  recipientValue: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  amountContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  amountLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: "600",
    color: Colors.text,
    marginRight: 8,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
    minWidth: 100,
  },
  amountPreview: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  quickAmountsContainer: {
    marginBottom: 32,
  },
  quickAmountsLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
    marginBottom: 16,
  },
  quickAmountsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
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
    fontWeight: "500",
    color: Colors.text,
  },
  activeQuickAmountText: {
    color: Colors.background,
  },
  noteContainer: {
    marginBottom: 32,
  },
  noteLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
    marginBottom: 12,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.background,
    minHeight: 80,
    textAlignVertical: "top",
  },
  continueButton: {
    marginTop: "auto",
  },
});
