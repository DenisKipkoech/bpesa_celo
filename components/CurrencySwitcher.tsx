import { CURRENCIES } from "@/constants/constants";
import React from "react";
import { useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  TextInput,
} from "react-native";

const CurrencySwitcher = () => {
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");

  const filteredCurrencies = CURRENCIES.filter(
    (item) =>
      item.country.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectCurrency = (currency: any) => {
    setSelectedCurrency(currency);
    setModalVisible(false);
    setSearch("");
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      //   style={styles.currencyItem}
      onPress={() => handleSelectCurrency(item)}
    >
      {/* <Text style={styles.flag}>{item.flag}</Text> */}
      <Text>{item.flag}</Text>
      <Text>{item.country}</Text>
      <Text>({item.code})</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
      >
        <Text>
          {selectedCurrency.flag} {selectedCurrency.country} (
          {selectedCurrency.code})
        </Text>
      </TouchableOpacity>


      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View >
          <View >
            <View >
              <Text >Select Currency</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text >✕</Text>
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <TextInput
              placeholder="Search country or code..."
              value={search}
              onChangeText={setSearch}
            />

            {/* List of Currencies */}
            <FlatList
              data={filteredCurrencies}
              renderItem={renderItem}
              keyExtractor={(item) => item.code}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CurrencySwitcher;
