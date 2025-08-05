import { CURRENCIES } from "@/constants/constants";
import { useWalletStore } from "@/stores/wallet-store";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";
import RNModal from "react-native-modal";

type Currency = {
  code: string;
  name: string;
  flag: string;
  token: string;
};

interface CurrencySwitcherProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export default function CurrencySwitcher({
  onRefresh,
  isRefreshing,
}: CurrencySwitcherProps) {
  const { updateCurrency, currency } = useWalletStore();

  const [selectedCurrency, setSelectedCurrency] = useState<Currency | any>(
    CURRENCIES[0]
  );

  useEffect(() => {
    if (currency) {
      const _curr = CURRENCIES.find((curr) => curr.token === currency);
      setSelectedCurrency(_curr);
    }
  }, [currency]);

  const [search, setSearch] = useState<string>("");
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const filteredCurrencies = CURRENCIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const selectCurrency = (currency: Currency) => {
    setSelectedCurrency(currency);
    updateCurrency(currency.token);
    onRefresh();
    closeModal();
  };

  const renderCurrencyItem = ({ item }: { item: Currency }) => (
    <TouchableOpacity
      style={styles.currencyItem}
      onPress={() => selectCurrency(item)}
    >
      <Image source={{ uri: item?.flag }} style={styles.flag} />
      <Text style={styles.currencyTextItem}>
        {item?.code} - {item?.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View
    // style={styles.container}
    >
      {/* Selected Currency */}
      {isRefreshing ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <TouchableOpacity style={styles.currencyButton} onPress={openModal}>
          <Image source={{ uri: selectedCurrency.flag }} style={styles.flag} />
          <Text style={styles.currencyText}>{selectedCurrency.code}</Text>
        </TouchableOpacity>
      )}

      {/* Modal */}
      <RNModal
        isVisible={isModalVisible}
        onBackdropPress={closeModal}
        style={styles.modal}
        swipeDirection="down"
        onSwipeComplete={closeModal}
      >
        <View style={styles.modalContent}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search currency..."
            value={search}
            onChangeText={setSearch}
          />
          <FlatList
            data={filteredCurrencies}
            keyExtractor={(item) => item.code}
            renderItem={renderCurrencyItem}
          />
        </View>
      </RNModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  currencyButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    // borderWidth: 1,
    // borderRadius: 8,
    // borderColor: '#ccc',
  },
  flag: { width: 16, height: 12, marginRight: 10, borderRadius: 3 },
  currencyText: { fontSize: 12, color: "#fff", fontWeight: 600 },
  currencyTextItem: { fontSize: 14, fontWeight: 600 },
  modal: { justifyContent: "flex-end", margin: 0 },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    maxHeight: "80%",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  currencyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
});
