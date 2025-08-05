import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { CheckBox } from 'react-native-elements';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

const countries = [
  { label: 'Select Country', value: '' },
  { label: 'Kenya', value: 'KE' },
  { label: 'Uganda', value: 'UG' },
  { label: 'Tanzania', value: 'TZ' },
  { label: 'Rwanda', value: 'RW' },
  { label: 'Burundi', value: 'BI' },
  { label: 'South Sudan', value: 'SS' },
  { label: 'Ethiopia', value: 'ET' },
  { label: 'Somalia', value: 'SO' },
  { label: 'Nigeria', value: 'NG' },
];

export default function OnboardingPage() {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [allowNotifications, setAllowNotifications] = useState(true);
  const [expoToken, setExpoToken] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!selectedCountry) return Alert.alert('Error', 'Please select your country');
    if (!nationalId.trim()) return Alert.alert('Error', 'Please enter your ID number');

    let pushToken = expoToken;

    if (allowNotifications && !expoToken) {
      try {
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== 'granted') {
          const request = await Notifications.requestPermissionsAsync();
          if (request.status !== 'granted') {
            Alert.alert('Permission Denied', 'Push notifications are disabled.');
            return;
          }
        }

        const tokenData = await Notifications.getExpoPushTokenAsync();
        pushToken = tokenData.data;
        setExpoToken(pushToken);
      } catch (error) {
        console.error('Error fetching push token', error);
        Alert.alert('Error', `Failed to get push notification token.${error}`);
        return;
      }
    }

    // ✅ Navigate to pin setup screen
    router.push({
      pathname: '/pin-setup',
      params: {
        country: selectedCountry,
        id: nationalId.trim(),
        expoToken: pushToken || '',
      },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Complete Your Profile</Text>
      <Text style={styles.subtitle}>Enter your ID to comply with regulations. Your details will never be shared and are fully encrypted</Text>

      {/* Country Picker */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Country *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedCountry}
            onValueChange={setSelectedCountry}
            mode="dropdown"
            style={[styles.picker, { color: '#000' }]}
          >
            {countries.map((c) => (
              <Picker.Item key={c.value} label={c.label} value={c.value} />
            ))}
          </Picker>
        </View>
      </View>

      {/* National ID Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>National ID / Passport *</Text>
        <TextInput
          style={styles.textInput}
          value={nationalId}
          onChangeText={setNationalId}
          placeholder="e.g. 12345678"
        />
      </View>

      {/* Notifications */}
      <View style={styles.checkboxContainer}>
        <CheckBox
          title="Allow transaction notifications (recommended)"
          checked={allowNotifications}
          onPress={() => setAllowNotifications((prev) => !prev)}
          containerStyle={{
            backgroundColor: 'transparent',
            borderWidth: 0,
            padding: 0,
            margin: 0,
          }}
          wrapperStyle={{
            backgroundColor: 'transparent',
          }}
          textStyle={{
            color: '#000', // or use your Colors.text if themed
            fontSize: 16,
          }}
          uncheckedColor="#999"
          checkedColor="#007AFF"
        />
      </View>

      {/* Submit */}
      <TouchableOpacity
        onPress={handleSubmit}
        style={[
          styles.submitButton,
          (!selectedCountry || !nationalId) && styles.submitButtonDisabled,
        ]}
        disabled={!selectedCountry || !nationalId}
      >
        <Text style={styles.submitButtonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 80,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'android' ? 50 : undefined,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  checkboxContainer: {
    marginBottom: 32,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#999',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
