import React, { useState, useRef } from "react";
import { StyleSheet, View, Text, Alert, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Shield } from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { Button } from "@/components/Button";
import { PinInput } from "@/components/PinInput";
import { useWalletStore } from "@/stores/wallet-store";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PinVerifyScreen() {
  const router = useRouter();
  const { returnTo, transactionData } = useLocalSearchParams<{
    returnTo: string;
    transactionData?: string;
  }>();

  const {
    unlockWallet,
    signEIP2612Transaction,
    resetWalletApp,
    isUnlocking,
  } = useWalletStore();

  const [loading, setLoading] = useState(false);

  const isHandlingRef = useRef(false);      // prevents multiple unlocks
  const hasNavigatedRef = useRef(false);    // prevents double navigation

  const handlePinComplete = async (pin: string) => {
    if (isHandlingRef.current || isUnlocking) return;
    isHandlingRef.current = true;
    setLoading(true);

    try {
      console.log("Unlocking status", isUnlocking);
      const unlocked = await unlockWallet(pin);
      console.log("unlocked status", unlocked);

      if (!unlocked) {
        Alert.alert("Invalid PIN", "Please try again.");
        return;
      }

      if (transactionData) {
        const txData = JSON.parse(transactionData);
        console.log("TRANSACTION RETURN TO", returnTo);
        console.log("TRANSACTION DATA", txData);

        if (txData.permitData) {
          const signature = await signEIP2612Transaction(txData.permitData, pin);

          if (!hasNavigatedRef.current) {
            hasNavigatedRef.current = true;
            router.replace({
              pathname: returnTo as any,
              params: { signature, transactionData },
            });
          }
        } else {
          if (!hasNavigatedRef.current) {
            hasNavigatedRef.current = true;
            router.replace({
              pathname: returnTo as any,
              params: { transactionData },
            });
          }
        }
      } else {
        if (!hasNavigatedRef.current) {
          hasNavigatedRef.current = true;
          router.replace(returnTo as any);
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      Alert.alert("Error", "Authentication failed");
    } finally {
      setLoading(false);
      isHandlingRef.current = false;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Shield size={64} color={Colors.primary} />
        <Text style={styles.title}>Enter Your PIN</Text>
        <Text style={styles.subtitle}>
          {transactionData
            ? "Verify your PIN to authorize this transaction"
            : "Enter your PIN to continue"}
        </Text>

        <PinInput onComplete={handlePinComplete} loading={loading} />

        <TouchableOpacity onPress={resetWalletApp}>
          <Text>Reset App</Text>
        </TouchableOpacity>

        {/* {transactionData && (
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionTitle}>🔐 Blockchain Security</Text>
            <Text style={styles.transactionText}>
              Your PIN will decrypt your private key to sign this transaction
              using EIP-2612 permit on the Celo blockchain.
            </Text>
          </View>
        )} */}
      </View>

      <Button
        title="Cancel"
        onPress={() => router.back()}
        variant="outline"
        style={styles.cancelButton}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
    marginTop: 24,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 48,
    textAlign: "center",
  },
  transactionInfo: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 32,
    width: "100%",
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  transactionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  cancelButton: {
    marginTop: 20,
  },
});
