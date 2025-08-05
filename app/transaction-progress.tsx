import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, Alert, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Check, Clock, Send } from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { Button } from "@/components/Button";
import { formatCurrency } from "@/utils/formatters";
import { useWalletStore } from "@/stores/wallet-store";
import { sendTransaction, withdrawAtAgent } from "@/utils/api";
import { SafeAreaView } from 'react-native-safe-area-context';

type ProgressStep = "preparing" | "signing" | "sending" | "success" | "error";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function TransactionProgressScreen() {
  const router = useRouter();
  const { signature, transactionData } = useLocalSearchParams<{
    signature?: string;
    transactionData?: string;
  }>();

  const { walletAddress,country } = useWalletStore();
  const [currentStep, setCurrentStep] = useState<ProgressStep>("preparing");
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const txData = transactionData ? JSON.parse(transactionData) : null;

  const hasProcessedRef = useRef(false);

  useEffect(() => {
    console.log("current step ", currentStep);
    if (signature && txData && !hasProcessedRef.current) {
      hasProcessedRef.current = true;
      processTransaction();
    } else if (!signature && !txData) {
      // fallback flow — run only once too
      setTimeout(() => setCurrentStep("signing"), 1000);
      setTimeout(() => setCurrentStep("sending"), 3000);
      setTimeout(() => setCurrentStep("success"), 5000);
    }
  }, [signature, txData]);

  const processTransaction = async () => {
    try {
      setCurrentStep("signing");
      await delay(2000);
      setCurrentStep("sending");
        const t0 = Date.now();
      if (txData.type == "send") {
        // Send transaction to API
        console.log("Sending Transaction");
        // const t0 = Date.now();

        const response = await sendTransaction({
          from: walletAddress!,
          to: txData.recipient,
          amount: txData.amount.toString(),
          signature: signature!,
          permitData: txData.permitData,
          transactionData: txData,
          txType:"0"
        });

        console.log("current step ", currentStep);
        console.log(response);

        if (response.success) {
          console.log("Transaction Success took", Date.now() - t0, "ms");
          setTransactionHash(response.transactionHash || "");
          setCurrentStep("success");
        } else {
          console.log("Transaction error took", Date.now() - t0, "ms");
          setErrorMessage(response.error || "Transaction failed");
          setCurrentStep("error");
        }
      } else {
        console.log("Withdrawing");
        const response = await withdrawAtAgent({
          from: walletAddress!,
          to: txData.recipient,
          amount: txData.amount.toString(),
          signature: signature!,
          permitData: txData.permitData,
          transactionData: txData,
          txType:"3"
        });
        // console.log(response)
        // setCurrentStep("success");

         if (response.success) {
          console.log('Transaction Success took', Date.now() - t0, 'ms');
          setTransactionHash(response.transactionHash || '');
          setCurrentStep('success');
        } else {
          console.log('Transaction error took', Date.now() - t0, 'ms');
          setErrorMessage(response.error || 'Transaction failed');
          setCurrentStep('error');
        }
      }
    } catch (error) {
      console.error("Transaction failed:", error);
      setErrorMessage("Network error occurred");
      setCurrentStep("error");
    }
  };

  //   const processTransaction = async () => {
  //   try {
  //     setCurrentStep('signing');
  //     await delay(2000);
  //     setCurrentStep('sending');

  //     // Simulate network delay (e.g., 3 seconds)
  //     await delay(3000);

  //     const response = {
  //       success: true,
  //       transactionHash: "0x3231434123rdsdcade123edw12e1d2ed23",
  //       error: null,
  //     };

  //     console.log("current step", currentStep);

  //     if (response.success) {
  //       setTransactionHash(response.transactionHash || '');
  //       setCurrentStep('success');
  //     } else {
  //       setErrorMessage(response.error || 'Transaction failed');
  //       setCurrentStep('error');
  //     }
  //   } catch (error) {
  //     console.error('Transaction failed:', error);
  //     setErrorMessage('Network error occurred');
  //     setCurrentStep('error');
  //   }
  // };

  const handleDone = () => {
    router.replace("/(tabs)");
  };

  const handleRetry = () => {
    router.back();
  };

  const getStepIcon = (step: ProgressStep) => {
    switch (step) {
      case "preparing":
        return (
          <Clock
            size={24}
            color={
              currentStep === "preparing"
                ? Colors.primary
                : Colors.textSecondary
            }
          />
        );
      case "signing":
        return (
          <Send
            size={24}
            color={
              currentStep === "signing" ? Colors.primary : Colors.textSecondary
            }
          />
        );
      case "sending":
        return (
          <Send
            size={24}
            color={
              currentStep === "sending" ? Colors.primary : Colors.textSecondary
            }
          />
        );
      case "success":
        return <Check size={24} color={Colors.success} />;
      case "error":
        return <Text style={{ color: Colors.error, fontSize: 24 }}>✕</Text>;
    }
  };

  const getStepStatus = (step: ProgressStep) => {
    const stepOrder = ["preparing", "signing", "sending", "success"];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(step);

    if (currentStep === "error") {
      return stepIndex <= stepOrder.indexOf("sending")
        ? "completed"
        : "pending";
    }

    if (currentStep === step) return "active";
    if (stepIndex < currentIndex) return "completed";
    return "pending";
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {currentStep === "success"
            ? "Transaction Successful!"
            : currentStep === "error"
            ? "Transaction Failed"
            : "Processing Transaction..."}
        </Text>

        {txData && (
          <>
            <Text style={styles.amount}>{formatCurrency(txData.amount,country)}</Text>
            <Text style={styles.recipient}>to {txData.recipient}</Text>
          </>
        )}

        <View style={styles.progressContainer}>
          <ProgressStepItem
            icon={getStepIcon("preparing")}
            title="Preparing Transaction"
            description="Validating recipient and amount"
            status={getStepStatus("preparing")}
          />

          <ProgressStepItem
            icon={getStepIcon("signing")}
            title="Approving Transaction"
            description="Commiting approval"
            status={getStepStatus("signing")}
          />

          <ProgressStepItem
            icon={getStepIcon("sending")}
            title="Sending Transaction"
            description="Sending to recipient"
            status={getStepStatus("sending")}
          />

          <ProgressStepItem
            icon={getStepIcon("success")}
            title="Transaction Complete"
            description={
              currentStep === "error"
                ? "Transaction failed"
                : "Money sent successfully"
            }
            status={
              currentStep === "error" ? "error" : getStepStatus("success")
            }
            isLast
          />
        </View>

        {/* {currentStep === 'success' && (
          <View style={styles.successDetails}>
            <Text style={styles.successMessage}>
              Your money has been sent successfully on the Celo blockchain.
            </Text>
            {transactionHash && (
              <View style={styles.hashContainer}>
                <Text style={styles.hashLabel}>Transaction Hash:</Text>
                <Text style={styles.hashText}>{transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}</Text>
              </View>
            )}
            {txData?.note && (
              <View style={styles.noteContainer}>
                <Text style={styles.noteLabel}>Note:</Text>
                <Text style={styles.noteText}>{txData.note}</Text>
              </View>
            )}
          </View>
        )} */}

        {currentStep === "error" && (
          <View style={styles.errorDetails}>
            <Text style={styles.errorMessage}>
              {errorMessage || "Something went wrong. Please try again."}
            </Text>
          </View>
        )}
      </View>

      {(currentStep === "success" || currentStep === "error") && (
        <View style={styles.buttonContainer}>
          {currentStep === "success" ? (
            <Button title="Done" onPress={handleDone} fullWidth size="large" />
          ) : (
            <>
              <Button
                title="Try Again"
                onPress={handleRetry}
                fullWidth
                size="large"
                style={styles.retryButton}
              />
              <Button
                title="Go Home"
                onPress={handleDone}
                variant="outline"
                fullWidth
                size="large"
              />
            </>
          )}
        </View>
      )}
    </ScrollView>
    </SafeAreaView>
  );
}

interface ProgressStepItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: "pending" | "active" | "completed" | "error";
  isLast?: boolean;
}

const ProgressStepItem: React.FC<ProgressStepItemProps> = ({
  icon,
  title,
  description,
  status,
  isLast = false,
}) => {
  return (
    <View style={styles.stepContainer}>
      <View style={styles.stepIconContainer}>
        <View
          style={[
            styles.stepIcon,
            status === "active" && styles.activeStepIcon,
            status === "completed" && styles.completedStepIcon,
            status === "error" && styles.errorStepIcon,
          ]}
        >
          {icon}
        </View>
        {!isLast && (
          <View
            style={[
              styles.stepLine,
              status === "completed" && styles.completedStepLine,
            ]}
          />
        )}
      </View>
      <View style={styles.stepContent}>
        <Text
          style={[
            styles.stepTitle,
            status === "active" && styles.activeStepTitle,
            status === "completed" && styles.completedStepTitle,
            status === "error" && styles.errorStepTitle,
          ]}
        >
          {title}
        </Text>
        <Text style={styles.stepDescription}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 16,
  },
  amount: {
    fontSize: 36,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 8,
  },
  recipient: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 48,
  },
  progressContainer: {
    width: "100%",
    maxWidth: 300,
  },
  stepContainer: {
    flexDirection: "row",
    marginBottom: 24,
  },
  stepIconContainer: {
    alignItems: "center",
    marginRight: 16,
  },
  stepIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.border,
  },
  activeStepIcon: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  completedStepIcon: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  errorStepIcon: {
    backgroundColor: Colors.error,
    borderColor: Colors.error,
  },
  stepLine: {
    width: 2,
    height: 24,
    backgroundColor: Colors.border,
    marginTop: 8,
  },
  completedStepLine: {
    backgroundColor: Colors.success,
  },
  stepContent: {
    flex: 1,
    paddingTop: 8,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  activeStepTitle: {
    color: Colors.text,
    fontWeight: "600",
  },
  completedStepTitle: {
    color: Colors.success,
    fontWeight: "600",
  },
  errorStepTitle: {
    color: Colors.error,
    fontWeight: "600",
  },
  stepDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  successDetails: {
    marginTop: 32,
    alignItems: "center",
  },
  successMessage: {
    fontSize: 16,
    color: Colors.text,
    textAlign: "center",
    marginBottom: 16,
  },
  hashContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    width: "100%",
    marginBottom: 16,
  },
  hashLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  hashText: {
    fontSize: 16,
    color: Colors.text,
    fontFamily: "monospace",
  },
  noteContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    width: "100%",
  },
  noteLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  noteText: {
    fontSize: 16,
    color: Colors.text,
  },
  errorDetails: {
    marginTop: 32,
    alignItems: "center",
  },
  errorMessage: {
    fontSize: 16,
    color: Colors.error,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 20,
  },
  retryButton: {
    marginBottom: 12,
  },
});
