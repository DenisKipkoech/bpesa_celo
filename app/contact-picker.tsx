import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, User, Plus, Trash } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { useContactStore } from '@/stores/contact-store';

export default function ContactPickerScreen() {
  const router = useRouter();
  const { contacts, addContact, removeContact } = useContactStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phoneNumber.includes(searchQuery)
  );

  const handleSelectContact = (contact: any) => {
    router.replace({
      pathname: '/send-amount',
      params: { 
        recipient: contact.phoneNumber,
        inputMethod: 'contact'
      }
    });
  };

  const handleAddContact = () => {
    if (!newContactName.trim() || !newContactPhone.trim()) {
      Alert.alert('Error', 'Please enter both name and phone number');
      return;
    }

    addContact({
      id: Date.now().toString(),
      name: newContactName.trim(),
      phoneNumber: newContactPhone.trim(),
      alias: newContactName.toLowerCase().replace(/\s+/g, '_'),
    });

    setNewContactName('');
    setNewContactPhone('');
    setShowAddContact(false);
    Alert.alert('Success', 'Contact added successfully');
  };

  const renderContact = ({ item }: { item: any }) => {
  const handleDelete = () => {
    Alert.alert(
      'Remove Contact',
      `Are you sure you want to remove ${item.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeContact(item.id),
        },
      ]
    );
  };

  return (
    <View style={styles.contactItem}>
      <TouchableOpacity
        style={styles.contactMain}
        onPress={() => handleSelectContact(item)}
      >
        <View style={styles.contactAvatar}>
          <Text style={styles.contactAvatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactPhone}>{item.phoneNumber}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDelete}>
        <Trash size={20} color={Colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
};


  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {!showAddContact ? (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Select Contact</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddContact(true)}
            >
              <Plus size={20} color={Colors.primary} />
              <Text style={styles.addButtonText}>Add Contact</Text>
            </TouchableOpacity>
          </View>

          {filteredContacts.length > 0 ? (
            <FlatList
              data={filteredContacts}
              renderItem={renderContact}
              keyExtractor={(item) => item.id}
              style={styles.contactsList}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <User size={48} color={Colors.textSecondary} />
              <Text style={styles.emptyStateTitle}>No contacts found</Text>
              <Text style={styles.emptyStateText}>
                {searchQuery ? 'Try a different search term' : 'Add your first contact to get started'}
              </Text>
            </View>
          )}
        </>
      ) : (
        <View style={styles.addContactForm}>
          <Text style={styles.formTitle}>Add New Contact</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter contact name"
              value={newContactName}
              onChangeText={setNewContactName}
              autoFocus
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              value={newContactPhone}
              onChangeText={setNewContactPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.formButtons}>
            <Button
              title="Cancel"
              onPress={() => setShowAddContact(false)}
              variant="outline"
              style={styles.cancelButton}
            />
            <Button
              title="Add Contact"
              onPress={handleAddContact}
              style={styles.addContactButton}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.text,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  contactsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  // contactItem: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   paddingVertical: 16,
  //   borderBottomWidth: 1,
  //   borderBottomColor: Colors.border,
  // },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactAvatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.background,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  addContactForm: {
    flex: 1,
    padding: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
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
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  cancelButton: {
    flex: 1,
  },
  addContactButton: {
    flex: 1,
  },
  contactItem: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between', // for the delete icon
  paddingVertical: 16,
  borderBottomWidth: 1,
  borderBottomColor: Colors.border,
},

contactMain: {
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
},

});