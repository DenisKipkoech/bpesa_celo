import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Filter } from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { TransactionCard, TransactionType } from "@/components/TransactionCard";
import { mockTransactions } from "@/mocks/transactions";
import { useWalletStore } from "@/stores/wallet-store";
import { getUserTransactions } from "@/utils/blockchain";
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

export default function TransactionsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { walletAddress } = useWalletStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeFilter, setActiveFilter] = useState<TransactionType | "all">(
    "all"
  );

  useEffect(() => {
    if (!walletAddress) return;

    setLoading(true);

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
          const formattedSender = isAgent(fromNumber)
            ? formatAgentNumber(fromNumber)
            : fromNumber;
          const formattedRecipient = isOutgoing
            ? isAgent(toNumber)
              ? formatAgentNumber(toNumber)
              : toNumber
            : isAgent(fromNumber)
            ? formatAgentNumber(fromNumber)
            : fromNumber;

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
        setTransactions(sorted);
      })
      .catch((err) => {
        console.error("Failed to load user transactions:", err);
      })
      .finally(() => setLoading(false));
  }, [walletAddress]);

  const filteredTransactions =
    activeFilter === "all"
      ? transactions
      : transactions.filter((t) => t.type === activeFilter);

  const handleTransactionPress = (tx: Transaction) => {
    router.push({
      pathname: "/transactions/[id]",
      params: {
        id: tx.id,
        transaction: JSON.stringify(tx),
      },
    });
  };
  const handleFilterPress = (filter: TransactionType | "all") => {
    setActiveFilter(filter);
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <View style={styles.filterHeader}>
          <Filter size={20} color={Colors.text} />
          <Text style={styles.filterTitle}>Filter Transactions</Text>
        </View>
        <ScrollableFilters
          activeFilter={activeFilter}
          onFilterPress={handleFilterPress}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TransactionCard
              id={item.id}
              type={item.type}
              amount={item.amount}
              recipient={item.recipient}
              date={item.date}
              onPress={() => handleTransactionPress(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

interface ScrollableFiltersProps {
  activeFilter: TransactionType | "all";
  onFilterPress: (filter: TransactionType | "all") => void;
}

const ScrollableFilters: React.FC<ScrollableFiltersProps> = ({
  activeFilter,
  onFilterPress,
}) => {
  const filters: Array<{ label: string; value: TransactionType | "all" }> = [
    { label: "All", value: "all" },
    { label: "Sent", value: "send" },
    { label: "Received", value: "receive" },
    // { label: 'Loaded', value: 'load' },
    { label: "Withdrawn", value: "withdraw" },
  ];

  return (
    <View style={styles.filtersRow}>
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.value}
          style={[
            styles.filterButton,
            activeFilter === filter.value && styles.activeFilterButton,
          ]}
          onPress={() => onFilterPress(filter.value)}
        >
          <Text
            style={[
              styles.filterButtonText,
              activeFilter === filter.value && styles.activeFilterButtonText,
            ]}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  filterContainer: {
    padding: 16,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
    marginLeft: 8,
  },
  filtersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeFilterButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
  },
  activeFilterButtonText: {
    color: Colors.background,
  },
  listContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
