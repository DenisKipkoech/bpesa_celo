import React, { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";

import { useRouter } from "expo-router";
import { QrCode, Phone, Users, User } from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { Button } from "@/components/Button";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SendMoneyScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [aliasName, setAliasName] = useState("");
  const [inputMethod, setInputMethod] = useState<"phone" | "alias">("phone");
  const { height: screenHeight } = Dimensions.get("window");

  // Add this ref declaration in your component
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScanQR = () => {
    router.push("/qr-scanner");
  };

  const handleSelectContact = () => {
    router.push("/contact-picker");
  };

  const handleContinue = () => {
    if (inputMethod === "phone" && !phoneNumber.trim()) {
      Alert.alert("Error", "Please enter a phone number");
      return;
    }
    if (inputMethod === "alias" && !aliasName.trim()) {
      Alert.alert("Error", "Please enter an alias name");
      return;
    }

    const recipient = inputMethod === "phone" ? phoneNumber : aliasName;
    router.push({
      pathname: "/send-amount",
      params: { recipient, inputMethod },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: 100, // Increased padding for better spacing
          minHeight: screenHeight * 0.8, // Ensure minimum height for scrollability
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Text style={styles.title}>Select sending method</Text>

        <View style={styles.methodsContainer}>
          <TouchableOpacity style={styles.methodCard} onPress={handleScanQR}>
            <View style={styles.methodIcon}>
              <QrCode size={32} color={Colors.primary} />
            </View>
            <Text style={styles.methodTitle}>Scan QR Code</Text>
            <Text style={styles.methodDescription}>
              Scan recipient's QR code
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.methodCard}
            onPress={handleSelectContact}
          >
            <View style={styles.methodIcon}>
              <Users size={32} color={Colors.primary} />
            </View>
            <Text style={styles.methodTitle}>From Contacts</Text>
            <Text style={styles.methodDescription}>
              Select from your contacts
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputMethodToggle}>
            {/* <TouchableOpacity
              style={[
                styles.toggleButton,
                inputMethod === "phone" && styles.activeToggleButton,
              ]}
              onPress={() => setInputMethod("phone")}
            >
              <Phone
                size={16}
                color={
                  inputMethod === "phone"
                    ? Colors.background
                    : Colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.toggleText,
                  inputMethod === "phone" && styles.activeToggleText,
                ]}
              >
                Phone
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                inputMethod === "alias" && styles.activeToggleButton,
              ]}
              onPress={() => setInputMethod("alias")}
            >
              <User
                size={16}
                color={
                  inputMethod === "alias"
                    ? Colors.background
                    : Colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.toggleText,
                  inputMethod === "alias" && styles.activeToggleText,
                ]}
              >
                Alias
              </Text>
            </TouchableOpacity> */}
          </View>

          {inputMethod === "phone" ? (
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              returnKeyType="done"
              onFocus={() => {
                // Scroll to input when focused
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);
              }}
            />
          ) : (
            <TextInput
              style={styles.input}
              placeholder="Enter alias name"
              value={aliasName}
              onChangeText={setAliasName}
              autoCapitalize="none"
              returnKeyType="done"
              onFocus={() => {
                // Scroll to input when focused
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);
              }}
            />
          )}
        </View>

        <Button
          title="Continue"
          onPress={handleContinue}
          fullWidth
          style={styles.continueButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
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
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 32,
    textAlign: "center",
  },
  methodsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  methodCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginHorizontal: 8,
  },
  methodIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  inputContainer: {
    marginBottom: 32,
  },
  inputMethodToggle: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 6,
  },
  activeToggleButton: {
    backgroundColor: Colors.primary,
  },
  toggleText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  activeToggleText: {
    color: Colors.background,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  continueButton: {
    marginTop: "auto",
  },
});
