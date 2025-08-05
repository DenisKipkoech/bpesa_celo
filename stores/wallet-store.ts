import 'react-native-get-random-values'; // Must be first import
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  generateMnemonic, 
  generateWalletFromMnemonic, 
  encryptWalletData, 
  decryptWalletData,
  generatePhoneNumber,
  EncryptedWalletData,
  WalletKeys,
  validatePin
} from '@/utils/crypto';
import { 
  signEIP2612Permit, 
  signTransaction, 
  getTransactionCount,
  EIP2612PermitData,
  TransactionData
} from '@/utils/blockchain';
import { getCurrentNetwork } from '@/constants/networks';



interface WalletState {
  isWalletCreated: boolean;
  walletAddress: string | null;
  phoneNumber: string | null;
  country:string;
  isPinSet: boolean;
  isUnlocking: boolean;
  isUnlocked: boolean;
  recoveryKeysBackedUp: boolean;
  _hasHydrated: boolean,
  createWallet: (pin: string,country:string,user_id: string,notification_token: string) => Promise<{ mnemonic: string; address: string; phoneNumber: string }>;
  unlockWallet: (pin: string) => Promise<boolean>;
  lockWallet: () => void;
  resetWalletApp: () => void;
  signEIP2612Transaction: (permitData: EIP2612PermitData, pin: string) => Promise<string>;
  signBlockchainTransaction: (transactionData: TransactionData, pin: string) => Promise<string>;
  backupRecoveryKeys: () => void;
  restoreWallet: (mnemonic: string, pin: string) => Promise<boolean>;
  getEncryptedMnemonic: (pin: string) => Promise<string | null>;
  changePin: (oldPin: string, newPin: string) => Promise<boolean>;
  setHasHydrated: (value: boolean) => void;
}


export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      isWalletCreated: false,
      walletAddress: null,
      phoneNumber: null,
      isPinSet: false,
      country:"",
      isUnlocking: false,
      isUnlocked: false,
      recoveryKeysBackedUp: false,
      _hasHydrated: false,
      setHasHydrated: (value) => set({ _hasHydrated: value }),
      resetWalletApp: async () => {
        try {
          // Clear all AsyncStorage (use with caution in shared storage apps)
          await AsyncStorage.clear();

          // Reset Zustand store to initial state
          useWalletStore.getState().lockWallet();
          useWalletStore.setState({
            isWalletCreated: false,
            walletAddress: null,
            phoneNumber: null,
            isPinSet: false,
            isUnlocked: false,
            recoveryKeysBackedUp: false,
          });

          console.log('App has been reset.');
        } catch (error) {
          console.error('Failed to reset app:', error);
        }
      },

      createWallet: async (pin: string,country:string,user_id: string,notification_token: string) => {
        try {
          console.log('Creating account with crypto polyfill...');
          console.log(pin,country,user_id,notification_token)

          // Validate PIN
          if (!validatePin(pin)) {
            throw new Error('Invalid PIN format');
          }

          // Generate mnemonic using our async method
          const mnemonic = await generateMnemonic();
          const walletKeys = generateWalletFromMnemonic(mnemonic);
          const phoneNumber = await generatePhoneNumber(walletKeys.address,user_id,notification_token,country);
          if(phoneNumber != null){
            console.log('Encrypting wallet data...');
            const t0 = Date.now();
            const encryptedData = await encryptWalletData(walletKeys, pin);
            console.log('Encryption took', Date.now() - t0, 'ms');

              await AsyncStorage.setItem('wallet_data', JSON.stringify(encryptedData));

              set({
                isWalletCreated: true,
                walletAddress: walletKeys.address,
                phoneNumber,
                isPinSet: true,
                isUnlocked: true,
                country:country
              });

              console.log('Wallet created successfully');
              return { mnemonic, address: walletKeys.address, phoneNumber };

            
          }else{
            console.log("phoneNumber",phoneNumber)
            throw new Error('Failed to create wallet'); 
          }

          
        } catch (error) {
          console.error('Failed to create wallet:', error);
          throw new Error('Failed to create wallet');
        }
      },

      unlockWallet: async (pin: string) => {
  if (get().isUnlocking) return false;

  console.log('Attempting to unlock wallet...');
  set({ isUnlocking: true });

  try {
    if (!validatePin(pin)) {
      console.error('Invalid PIN format');
      return false;
    }

    console.log('Attempting to get wallet data');
    const walletDataStr = await AsyncStorage.getItem('wallet_data');
    if (!walletDataStr) {
      console.error('No wallet found');
      return false;
    }

    const encryptedData: EncryptedWalletData = JSON.parse(walletDataStr);

    if (
      !encryptedData.encryptedMnemonic ||
      !encryptedData.ivPrivateKey ||
      !encryptedData.saltMnemonic
    ) {
      console.error('Invalid encrypted data structure');
      return false;
    }

    console.log('Attempting to decrypt pin');
    const t0 = Date.now();
    const walletKeys = await decryptWalletData(encryptedData, pin);
    console.log('Decryption took', Date.now() - t0, 'ms');

    if (!walletKeys) {
      console.error('Failed to decrypt wallet keys');
      return false;
    }

    set({ isUnlocked: true });
    return true;
  } catch (error) {
    console.error('Failed to unlock wallet:', error);
    return false;
  } finally {
    set({ isUnlocking: false }); // <- Always reset this, even on error
  }
},


      lockWallet: () => {
        set({ isUnlocked: false });
      },

      signEIP2612Transaction: async (permitData: EIP2612PermitData, pin: string) => {
        const { isUnlocked } = get();
        if (!isUnlocked) {
          throw new Error('Wallet is locked');
        }
        
        try {
          const walletDataStr = await AsyncStorage.getItem('wallet_data');
          if (!walletDataStr) {
            throw new Error('No wallet found');
          }
          
          const encryptedData: EncryptedWalletData = JSON.parse(walletDataStr);
          const walletKeys = await decryptWalletData(encryptedData, pin);
          
          const signature = await signEIP2612Permit(walletKeys.privateKey, permitData);
          return signature;
        } catch (error) {
          console.error('Failed to sign EIP-2612 permit:', error);
          throw new Error('Failed to sign transaction');
        }
      },

      signBlockchainTransaction: async (transactionData: TransactionData, pin: string) => {
        const { isUnlocked } = get();
        if (!isUnlocked) {
          throw new Error('Wallet is locked');
        }
        
        try {
          const walletDataStr = await AsyncStorage.getItem('wallet_data');
          if (!walletDataStr) {
            throw new Error('No wallet found');
          }
          
          const encryptedData: EncryptedWalletData = JSON.parse(walletDataStr);
          const walletKeys = await decryptWalletData(encryptedData, pin);
          
          const signature = await signTransaction(walletKeys.privateKey, transactionData);
          return signature;
        } catch (error) {
          console.error('Failed to sign transaction:', error);
          throw new Error('Failed to sign transaction');
        }
      },

      backupRecoveryKeys: () => {
        set({ recoveryKeysBackedUp: true });
      },

      restoreWallet: async (mnemonic: string, pin: string) => {
        try {
          const walletKeys = generateWalletFromMnemonic(mnemonic);
          const phoneNumber = await generatePhoneNumber(walletKeys.address,'','','');
          
          const encryptedData = await encryptWalletData(walletKeys, pin);
          
          set({
            isWalletCreated: true,
            walletAddress: walletKeys.address,
            phoneNumber,
            isPinSet: true,
            isUnlocked: true,
            recoveryKeysBackedUp: true,
          });
          
          await AsyncStorage.setItem('wallet_data', JSON.stringify(encryptedData));
          
          return true;
        } catch (error) {
          console.error('Failed to restore wallet:', error);
          return false;
        }
      },

      getEncryptedMnemonic: async (pin: string) => {
        try {
          const walletDataStr = await AsyncStorage.getItem('wallet_data');
          if (!walletDataStr) {
            return null;
          }
          
          const encryptedData: EncryptedWalletData = JSON.parse(walletDataStr);
          const walletKeys = await decryptWalletData(encryptedData, pin);
          
          return walletKeys.mnemonic;
        } catch (error) {
          console.error('Failed to get mnemonic:', error);
          return null;
        }
      },

      changePin: async (oldPin: string, newPin: string) => {
        try {
          const walletDataStr = await AsyncStorage.getItem('wallet_data');
          if (!walletDataStr) {
            throw new Error('No wallet found');
          }
          
          const encryptedData: EncryptedWalletData = JSON.parse(walletDataStr);
          const walletKeys = await decryptWalletData(encryptedData, oldPin);
          
          // Re-encrypt with new PIN
          const newEncryptedData = await encryptWalletData(walletKeys, newPin);
          await AsyncStorage.setItem('wallet_data', JSON.stringify(newEncryptedData));
          
          return true;
        } catch (error) {
          console.error('Failed to change PIN:', error);
          return false;
        }
      },
    }),
    {
      name: 'bpesa-wallet',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isWalletCreated: state.isWalletCreated,
        walletAddress: state.walletAddress,
        phoneNumber: state.phoneNumber,
        isPinSet: state.isPinSet,
        country:state.country,
        recoveryKeysBackedUp: state.recoveryKeysBackedUp,
      }),
      onRehydrateStorage: () => (state) => {
        // Called once state is loaded from AsyncStorage
        state?.setHasHydrated(true);
        console.log('✅ Zustand rehydration complete', state);
      },
    }
  )
);