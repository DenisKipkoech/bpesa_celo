import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  DollarSign,
} from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { BalanceCard } from "@/components/BalanceCard";
import { ActionButton } from "@/components/ActionButton";
import { TransactionCard, TransactionType } from "@/components/TransactionCard";
import { useWalletStore } from "@/stores/wallet-store";
import { getCurrentNetwork } from "@/constants/networks";
import { getCkesBalance, getUserTransactions } from "@/utils/blockchain";
import { ethers } from "ethers";

const mapTxType = (typeNum: number): TransactionType => {
  const types = [
    "send",
    "receive",
    "load",
    "withdraw",
    "deposit",
    "stake",
    "unstake",
    "claim",
  ];
  return types[typeNum] as TransactionType;
};
const decodeBytes10 = (bytes10: string): string => {
  return ethers.toUtf8String(bytes10).replace(/\0/g, "");
};

interface Transaction {
  id: string;
  type: TransactionType;
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

export default function HomeScreen() {
  const router = useRouter();
  const { walletAddress, phoneNumber, country } = useWalletStore();
  // const recentTransactions = mockTransactions.slice(0, 5);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );
  const network = getCurrentNetwork();
  const [balance, setBalance] = useState<string>("Loading...");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!walletAddress) return;

    getCkesBalance(walletAddress).then(setBalance).catch(console.error);

    getUserTransactions(walletAddress)
      .then((txs) => {
        const mapped = txs.map((tx: any, index: number) => {
          const isOutgoing =
            tx.from.toLowerCase() === walletAddress.toLowerCase();
          const rawType = mapTxType(tx.txType);
          const timestamp = Number(tx.timestamp);

          const fromNumber = decodeBytes10(tx.fromNumber);
          const toNumber = decodeBytes10(tx.toNumber);

          const type: TransactionType = (() => {
            if (["stake", "send", "withdraw"].includes(rawType))
              return isOutgoing ? "send" : "receive";
            if (["claim", "unstake", "receive"].includes(rawType))
              return "receive";
            if (["load", "deposit"].includes(rawType)) return "load";
            return "send";
          })();

          const isAgent = (number: string) =>
            number && number.length === 10 && number.startsWith("0000");

          const formatAgentNumber = (number: string) =>
            number?.slice(-6) || "unknown";

          // Format sender and recipient numbers accordingly
          // const formattedSender = isAgent(fromNumber)
          //   ? formatAgentNumber(fromNumber)
          //   : fromNumber;
          // const formattedRecipient = isOutgoing
          //   ? isAgent(toNumber)
          //     ? formatAgentNumber(toNumber)
          //     : toNumber
          //   : isAgent(fromNumber)
          //   ? formatAgentNumber(fromNumber)
          //   : fromNumber;
          const normalizeNumber = (number: string) => {
            if (!number) return "unknown";
            return number.startsWith("0") ? number : `0${number}`;
          };

          const formattedSender = isAgent(fromNumber)
            ? formatAgentNumber(fromNumber)
            : normalizeNumber(fromNumber);

          const formattedRecipient = isOutgoing
            ? isAgent(toNumber)
              ? formatAgentNumber(toNumber)
              : normalizeNumber(toNumber)
            : isAgent(fromNumber)
              ? formatAgentNumber(fromNumber)
              : normalizeNumber(fromNumber);

          return {
            id: tx.txReference || index.toString(),
            type,
            amount: Number(tx.amount) / 1e18,
            sender: formattedSender,
            recipient: formattedRecipient,
            senderAddress: tx.from,
            recipientAddress: tx.to,
            date: new Date(Number(tx.timestamp) * 1000).toLocaleString(
              "en-KE",
              {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }
            ),
            timestamp,
          };
        });

        const sorted = mapped.sort((a, b) => b.timestamp - a.timestamp);
        setRecentTransactions(sorted.slice(0, 5));
      })
      .catch((err) => {
        console.error("Failed to load user transactions:", err);
      })
      .finally(() => setIsRefreshing(false));
  }, [walletAddress]);

  const refreshBalance = async () => {
    console.log(balance);
    if (!walletAddress) return;
    try {
      setIsRefreshing(true);
      const latest = await getCkesBalance(walletAddress);
      console.log(latest);
      setBalance(latest);
    } catch (err) {
      console.error("Failed to refresh balance:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refreshBalance();
  }, [walletAddress]);

  const handleTransactionPress = (tx: Transaction) => {
    router.push({
      pathname: "/transactions/[id]",
      params: {
        id: tx.id,
        transaction: JSON.stringify(tx),
      },
    });
  };

  const handleViewAllPress = () => {
    router.push("/transactions");
  };

  const handleSendMoney = () => {
    router.push("/send-money");
  };

  const handleReceiveMoney = () => {
    router.push("/receive-money");
  };

  const handleStakeMoney = () => {
    Alert.alert("You can stake an amount to earn interest..(Work In Progress)");
    // router.push("/load-money");
  };

  const handleWithdrawMoney = () => {
    router.push("/withdraw-money");
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <BalanceCard
        balance={balance}
        phoneNumber={phoneNumber || "Loading..."}
        walletAddress={walletAddress || ""}
        networkName={network.name}
        country={country}
        onRefresh={refreshBalance}
        isRefreshing={isRefreshing}
      />

      <View style={styles.actionsContainer}>
        <ActionButton
          icon={ArrowUpRight}
          title="Send Money"
          onPress={handleSendMoney}
        />
        <ActionButton
          icon={ArrowDownLeft}
          title="Receive Money"
          onPress={handleReceiveMoney}
        />
        <ActionButton
          icon={DollarSign}
          title="Withdraw"
          onPress={handleWithdrawMoney}
        />
        <ActionButton icon={Wallet} title="Stake" onPress={handleStakeMoney} />
        {/* <ActionButton
          icon={DollarSign}
          title="Withdraw"
          onPress={handleWithdrawMoney}
        /> */}
      </View>

      <View style={styles.transactionsHeader}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <TouchableOpacity onPress={handleViewAllPress}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.transactionsContainer}>
        {recentTransactions.map((transaction) => (
          <TransactionCard
            key={transaction.id}
            id={transaction.id}
            type={transaction.type}
            amount={transaction.amount}
            recipient={transaction.recipient}
            date={transaction.date}
            onPress={() => handleTransactionPress(transaction)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 24,
  },
  transactionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.primary,
  },
  transactionsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});
