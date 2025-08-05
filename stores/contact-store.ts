import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  alias: string;
}

interface ContactState {
  contacts: Contact[];
  addContact: (contact: Contact) => void;
  removeContact: (id: string) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  getContactByPhone: (phoneNumber: string) => Contact | undefined;
}

export const useContactStore = create<ContactState>()(
  persist(
    (set, get) => ({
      contacts: [],
      addContact: (contact) =>
        set((state) => ({
          contacts: [...state.contacts, contact],
        })),
      removeContact: (id) =>
        set((state) => ({
          contacts: state.contacts.filter((contact) => contact.id !== id),
        })),
      updateContact: (id, updates) =>
        set((state) => ({
          contacts: state.contacts.map((contact) =>
            contact.id === id ? { ...contact, ...updates } : contact
          ),
        })),
      getContactByPhone: (phoneNumber) => {
        const { contacts } = get();
        return contacts.find((contact) => contact.phoneNumber === phoneNumber);
      },
    }),
    {
      name: 'bpesa-contacts',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);