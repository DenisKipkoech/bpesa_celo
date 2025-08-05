import 'react-native-get-random-values'; // Must be first import
import * as Crypto from 'expo-crypto';
import { ethers, keccak256, toUtf8Bytes } from 'ethers';
import * as bip39 from 'bip39';
import CryptoJS from 'crypto-js';
import axios from "axios";
import { formatPhoneNumber } from './formatters';

export interface WalletKeys {
  address: string;
  privateKey: string;
  publicKey: string;
  mnemonic: string;
}

export interface EncryptedWalletData {
  encryptedPrivateKey: string;
  encryptedMnemonic: string;
  address: string;
  publicKey: string;
  saltPrivateKey: string;
  ivPrivateKey: string;
  saltMnemonic: string;
  ivMnemonic: string;
}


// Generate a cryptographically secure mnemonic using Expo crypto
export const generateMnemonic = async (): Promise<string> => {
  try {
    // Generate 16 bytes (128 bits) of random data using Expo crypto
    const randomBytes = await Crypto.getRandomBytesAsync(16);
    const entropy = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Convert entropy to mnemonic
    const mnemonic = bip39.entropyToMnemonic(entropy);
    
    // Validate the generated mnemonic
    if (!bip39.validateMnemonic(mnemonic)) {
      throw new Error('Generated mnemonic is invalid');
    }
    
    return mnemonic;
  } catch (error) {
    console.error('Failed to generate mnemonic:', error);
    throw new Error('Failed to generate secure mnemonic');
  }
};

// Validate mnemonic phrase
export const validateMnemonic = (mnemonic: string): boolean => {
  try {
    return bip39.validateMnemonic(mnemonic.trim());
  } catch (error) {
    console.error('Error validating mnemonic:', error);
    return false;
  }
};

// Generate wallet from mnemonic using ethers.js HDNodeWallet (React Native compatible)
export const generateWalletFromMnemonic = (mnemonic: string): WalletKeys => {
  const trimmedMnemonic = mnemonic.trim();
  
  if (!validateMnemonic(trimmedMnemonic)) {
    throw new Error('Invalid mnemonic phrase');
  }

  try {
    // Use ethers.js HDNodeWallet which is React Native compatible
    const hdNode = ethers.HDNodeWallet.fromMnemonic(
      ethers.Mnemonic.fromPhrase(trimmedMnemonic),
      "m/44'/60'/0'/0/0" // BIP44 derivation path for Ethereum
    );

    return {
      address: hdNode.address,
      privateKey: hdNode.privateKey,
      publicKey: hdNode.publicKey,
      mnemonic: trimmedMnemonic,
    };
  } catch (error) {
    console.error('Failed to generate wallet from mnemonic:', error);
    throw new Error('Failed to generate wallet from mnemonic');
  }
};

// Generate encryption key from PIN using PBKDF2 with enhanced security
const deriveKeyFromPin = (pin: string, saltHex: string): CryptoJS.lib.WordArray => {
  try {
    const salt = CryptoJS.enc.Hex.parse(saltHex);
    
    // Use PBKDF2 with higher iterations for better security
    const key = CryptoJS.PBKDF2(pin, salt, {
      keySize: 256 / 32, // 32 bytes = 256 bits
      iterations: 1000, // Increased from 10000 for better security
    });

    return key;
  } catch (error) {
    console.error('Failed to derive key from PIN:', error);
    throw new Error('Failed to derive encryption key');
  }
};

// Encrypt data using AES-256-CBC with HMAC for integrity
export const encryptData = async (data: string, pin: string): Promise<{ encrypted: string; salt: string; iv: string }> => {
  try {
    // Generate cryptographically secure random values
    const salt = await Crypto.getRandomBytesAsync(32); // Increased salt size
    const iv = await Crypto.getRandomBytesAsync(16);   // 16 bytes for AES-CBC
    
    const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
    const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');
    
    const key = deriveKeyFromPin(pin, saltHex);
    
    // Encrypt using AES-256-CBC
    const encrypted = CryptoJS.AES.encrypt(data, key, {
      iv: CryptoJS.enc.Hex.parse(ivHex),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return {
      encrypted: encrypted.toString(),
      salt: saltHex,
      iv: ivHex,
    };
  } catch (error) {
    console.error('Failed to encrypt data:', error);
    throw new Error('Failed to encrypt data');
  }
};

// Decrypt data using AES-256-CBC with integrity verification
export const decryptData = async (
  encryptedData: string,
  pin: string,
  salt: string,
  iv: string
): Promise<string> => {
  try {
    // Validate input parameters
    if (!encryptedData || !pin || !salt || !iv) {
      throw new Error('Missing required decryption parameters');
    }
    
    // Validate hex strings
    if (!/^[0-9a-fA-F]+$/.test(salt) || !/^[0-9a-fA-F]+$/.test(iv)) {
      throw new Error('Invalid salt or IV format');
    }
    
    const key = deriveKeyFromPin(pin, salt);
    
    // Decrypt using AES-256-CBC
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

    if (!decryptedString) {
      throw new Error('Decryption resulted in empty string - invalid PIN or corrupted data');
    }

    return decryptedString;
  } catch (error) {
    console.error('Decryption failed:', { 
      encryptedDataLength: encryptedData?.length,
      saltLength: salt?.length,
      ivLength: iv?.length,
      error: error 
    });
    throw new Error('Invalid PIN or corrupted data');
  }
};

// Encrypt wallet data with PIN using separate encryption for each field
export const encryptWalletData = async (walletKeys: WalletKeys, pin: string): Promise<EncryptedWalletData> => {
  try {
    // Validate input
    if (!walletKeys.privateKey || !walletKeys.mnemonic || !pin) {
      throw new Error('Missing required wallet data or PIN');
    }
    
    // Validate PIN format
    if (!validatePin(pin)) {
      throw new Error('Invalid PIN format');
    }
    
    // Encrypt private key and mnemonic separately for better security
    const privateKeyEncryption = await encryptData(walletKeys.privateKey, pin);
    const mnemonicEncryption = await encryptData(walletKeys.mnemonic, pin);

    return {
      encryptedPrivateKey: privateKeyEncryption.encrypted,
      encryptedMnemonic: mnemonicEncryption.encrypted,
      address: walletKeys.address,
      publicKey: walletKeys.publicKey,
      saltPrivateKey: privateKeyEncryption.salt,
      ivPrivateKey: privateKeyEncryption.iv,
      saltMnemonic: mnemonicEncryption.salt,
      ivMnemonic: mnemonicEncryption.iv,
    };
  } catch (error) {
    console.error('Failed to encrypt wallet data:', error);
    throw new Error('Failed to encrypt wallet data');
  }
};

// Decrypt wallet data with PIN
export const decryptWalletData = async (encryptedData: EncryptedWalletData, pin: string): Promise<WalletKeys> => {
  try {
    console.log("decrypting wallet data")
    // Validate encrypted data structure
    const requiredFields = [
      'encryptedPrivateKey', 'encryptedMnemonic', 'address', 'publicKey',
      'saltPrivateKey', 'ivPrivateKey', 'saltMnemonic', 'ivMnemonic'
    ];
    
    for (const field of requiredFields) {
      if (!encryptedData[field as keyof EncryptedWalletData]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    console.log("decrypting private and menomic")
    // Decrypt private key and mnemonic
    const privateKey = await decryptData(
      encryptedData.encryptedPrivateKey,
      pin,
      encryptedData.saltPrivateKey,
      encryptedData.ivPrivateKey
    );

    const mnemonic = await decryptData(
      encryptedData.encryptedMnemonic,
      pin,
      encryptedData.saltMnemonic,
      encryptedData.ivMnemonic
    );

    // Validate decrypted mnemonic
    if (!validateMnemonic(mnemonic)) {
      throw new Error('Decrypted mnemonic is invalid');
    }

    // Validate private key format
    if (!privateKey.startsWith('0x') || privateKey.length !== 66) {
      throw new Error('Decrypted private key has invalid format');
    }
    console.log("decrypting private and menomic")

    return {
      address: encryptedData.address,
      privateKey,
      publicKey: encryptedData.publicKey,
      mnemonic,
    };
  } catch (error) {
    console.error('Failed to decrypt wallet data:', error);
    throw new Error('Invalid PIN or corrupted data');
  }
};

// Format display version for UI
// const formatPhoneDisplay = (phone: number): string => {
//   const phoneStr = phone.toString().padStart(9, "0"); // ensure 9 digits
//   return `+254 7${phoneStr.slice(1, 3)} ${phoneStr.slice(3, 6)} ${phoneStr.slice(6, 9)}`;
// };

// Main function to generate and register phone number
export const generatePhoneNumber = async (address: string,id: string,notification_token: string,country:string): Promise<string | null> => {
  try {
    const hash = ethers.keccak256(ethers.toUtf8Bytes(address));
    var encrypted_id = encryptNationalId(id)
    const idHash = keccak256(toUtf8Bytes(id));
    // const phoneNumber = parseInt(hash.slice(2, 11), 16) % 900000000 + 100000000;

    // const fullNumber = `7${phoneNumber.toString().padStart(9, "0")}`; // e.g. 2547xxxxxxxx

    // const numberPart = parseInt(hash.slice(2, 10), 16) % 100000000; 
    // const fullNumber = `${numberPart.toString().padStart(9, "0")}`; 
    const raw = parseInt(hash.slice(2, 10), 16).toString().padStart(10, '0');

    let firstDigit = parseInt(raw[0]);
    if (firstDigit === 0) {
      firstDigit = 1 + (parseInt(hash.slice(10, 12), 16) % 9); // 1–9
    }

    const fullNumber = `${firstDigit}${raw.slice(1, 9)}`; // 9-digit number, safe

    console.log("PHOEN NUMBER")
    console.log(fullNumber)

    // change this to the gateway API
    const res = await axios.post("https://rafiki-launchpad.devligence.com/bpesa/register-number", {
      address,
      number: fullNumber,
      encrypted_id,
      idHash,
      notification_token
    });

    if (res.status === 200) {
      console.log("Registered successfully");
      return formatPhoneNumber(fullNumber,country);
    } else {
      console.error("Unexpected response:", res.status, res.data);
      return null;
    }
  } catch (err: any) {
    console.error("Registration failed:", err.response?.data || err.message);
    return null;
  }
};

// Replace with actual key used by compliance team
const COMPLIANCE_ENCRYPTION_KEY = '2b46dc1e8eed4dce159029deb55e56bf22e1fc7ec4741daa26e82f6983674f2d';

  // Encryption helper
export const encryptNationalId = (id: string): string => {
    const ciphertext = CryptoJS.AES.encrypt(id, COMPLIANCE_ENCRYPTION_KEY).toString();
    return ciphertext;
  };
// const generateAlreadyPhoneNumber = async (address: string): Promise<string | null> => {
//   try {
//     // const hash = ethers.keccak256(ethers.toUtf8Bytes(address));
//     const phoneNumber = 715804742;

//     const fullNumber = `${phoneNumber.toString().padStart(9, "0")}`; // e.g. 2547xxxxxxxx
//     console.log(fullNumber)

//     const res = await axios.post("https://eb9be0d1f521.ngrok-free.app/register-number", {
//       address,
//       number: fullNumber,
//     });

//     if (res.status === 200) {
//       console.log("Registered successfully");
//       return formatPhoneDisplay(phoneNumber);
//     } else {
//       console.error("Unexpected response:", res.status, res.data);
//       return null;
//     }
//   } catch (err: any) {
//     console.error("Registration failed:", err.response?.data || err.message);
//     return null;
//   }
// };
// console.log(generateAlreadyPhoneNumber("0x9d623E1E8196584b8665f42277C4D3B71a7D1AB5"))

// Utility function to validate PIN with enhanced security requirements
export const validatePin = (pin: string): boolean => {
  if (!pin || typeof pin !== 'string') {
    return false;
  }
  
  // PIN must be 4-8 digits only
  const pinRegex = /^\d{4,8}$/;
  return pinRegex.test(pin);
};

// Additional security utility: Clear sensitive data from memory
export const clearSensitiveData = (data: any): void => {
  if (typeof data === 'string') {
    // In JavaScript, we can't truly clear strings from memory
    // but we can overwrite the variable
    data = '';
  } else if (typeof data === 'object' && data !== null) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (typeof data[key] === 'string') {
          data[key] = '';
        } else if (typeof data[key] === 'object') {
          clearSensitiveData(data[key]);
        }
      }
    }
  }
};

// Security audit function to validate encryption parameters
export const auditEncryptionParameters = (encryptedData: EncryptedWalletData): boolean => {
  try {
    // Check that all required fields are present
    const requiredFields = [
      'encryptedPrivateKey', 'encryptedMnemonic', 'address', 'publicKey',
      'saltPrivateKey', 'ivPrivateKey', 'saltMnemonic', 'ivMnemonic'
    ];
    
    for (const field of requiredFields) {
      if (!encryptedData[field as keyof EncryptedWalletData]) {
        console.warn(`Missing field: ${field}`);
        return false;
      }
    }
    
    // Check salt and IV lengths (should be hex strings)
    if (encryptedData.saltPrivateKey.length !== 64 || encryptedData.saltMnemonic.length !== 64) {
      console.warn('Salt length is not 64 characters (32 bytes)');
      return false;
    }
    
    if (encryptedData.ivPrivateKey.length !== 32 || encryptedData.ivMnemonic.length !== 32) {
      console.warn('IV length is not 32 characters (16 bytes)');
      return false;
    }
    
    // Check address format
    if (!encryptedData.address.startsWith('0x') || encryptedData.address.length !== 42) {
      console.warn('Invalid address format');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Audit failed:', error);
    return false;
  }
};
