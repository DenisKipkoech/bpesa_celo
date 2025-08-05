import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import {
  Copy,
  ExternalLink,
  Shield,
  HelpCircle,
  Settings,
} from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { truncateAddress } from "@/utils/formatters";
import { useWalletStore } from "@/stores/wallet-store";
import * as Clipboard from 'expo-clipboard';

export default function ProfileScreen() {
  const { resetWalletApp, phoneNumber, walletAddress } = useWalletStore();

  const handleCopyAddress = async () => {
    console.log(walletAddress);
    await Clipboard.setStringAsync(walletAddress!);
    console.log("Address copied to clipboard");
  };

  const handleViewOnExplorer = () => {
    // In a real app, would open external link
    console.log("Opening explorer");
    const url = `https://alfajores.celoscan.io/address/${walletAddress}`;
    Linking.openURL(url)
    .catch(err => console.error("Couldn't load page", err));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>B</Text>
        </View>
        <Text style={styles.phoneNumber}>{phoneNumber}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wallet Address</Text>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>
            {truncateAddress(walletAddress!, 10)}
          </Text>
          <View style={styles.addressActions}>
            <TouchableOpacity
              style={styles.addressAction}
              onPress={handleCopyAddress}
            >
              <Copy size={20} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addressAction}
              onPress={handleViewOnExplorer}
            >
              <ExternalLink size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.menuContainer}>
          <MenuItem
            icon={Shield}
            title="Security"
            onPress={() => {
              Alert.alert("(WIP)");
            }}
          />
          <MenuItem
            icon={HelpCircle}
            title="Help & Support"
            onPress={() => {
              Alert.alert("(WIP)");
            }}
          />
          <MenuItem
            icon={Settings}
            title="Settings"
            onPress={() => {
              Alert.alert("(WIP)");
            }}
            isLast
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.version}>Bpesa v1.0.0</Text>
        <Text style={styles.network}>Connected to Celo Alfajores Testnet</Text>
        <TouchableOpacity
          onPress={async () => {
            await resetWalletApp();
          }}
        >
          <Text>Reset App</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

interface MenuItemProps {
  icon: React.ComponentType<any>;
  title: string;
  onPress: () => void;
  isLast?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon: Icon,
  title,
  onPress,
  isLast = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.menuItem, isLast && styles.lastMenuItem]}
      onPress={onPress}
    >
      <View style={styles.menuItemContent}>
        <Icon size={20} color={Colors.text} />
        <Text style={styles.menuItemTitle}>{title}</Text>
      </View>
      <ExternalLink size={16} color={Colors.textSecondary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: Colors.card,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "700",
    color: Colors.background,
  },
  phoneNumber: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  section: {
    padding: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  addressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 8,
  },
  address: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: "500",
  },
  addressActions: {
    flexDirection: "row",
  },
  addressAction: {
    marginLeft: 16,
  },
  menuContainer: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemTitle: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
  footer: {
    padding: 16,
    alignItems: "center",
    marginTop: 32,
    marginBottom: 16,
  },
  version: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  network: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
