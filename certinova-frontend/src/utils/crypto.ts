// Crypto utility for encrypting and decrypting data using SHA-256 based encryption
import CryptoJS from 'crypto-js';

export interface EncryptedData {
  encryptedData: string;
  salt: string;
  iv: string;
}

/**
 * Derives a key from password using PBKDF2 with SHA-256
 */
function deriveKey(password: string, salt: string): string {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32, // 256 bits = 8 words of 32 bits
    iterations: 10000,
    hasher: CryptoJS.algo.SHA256
  }).toString();
}

/**
 * Encrypts data using AES with a password-derived key
 */
export function encryptData(data: unknown, password: string): EncryptedData {
  try {
    // Convert data to JSON string
    const jsonString = JSON.stringify(data);
    
    // Generate random salt and IV
    const salt = CryptoJS.lib.WordArray.random(128/8).toString(); // 128 bits
    const iv = CryptoJS.lib.WordArray.random(128/8); // 128 bits for AES
    
    // Derive key from password and salt
    const key = deriveKey(password, salt);
    
    // Encrypt the data
    const encrypted = CryptoJS.AES.encrypt(jsonString, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    return {
      encryptedData: encrypted.toString(),
      salt: salt,
      iv: iv.toString()
    };
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypts data using AES with a password-derived key
 */
export function decryptData(encryptedPackage: EncryptedData, password: string): unknown {
  try {
    const { encryptedData, salt, iv } = encryptedPackage;
    
    // Derive the same key from password and salt
    const key = deriveKey(password, salt);
    
    // Decrypt the data
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    // Convert decrypted data back to string
    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedString) {
      throw new Error('Invalid password or corrupted data');
    }
    
    // Parse JSON string back to object
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Decryption error:', error);
    if (error instanceof Error && error.message.includes('Invalid password')) {
      throw error;
    }
    throw new Error('Failed to decrypt data. Please check your password.');
  }
}

/**
 * Generates a hash of the password for verification purposes
 */
export function hashPassword(password: string): string {
  return CryptoJS.SHA256(password).toString();
}

/**
 * Cache management for encrypted data
 */
export class EncryptedCache {
  private static instance: EncryptedCache;
  private cache: Map<string, unknown> = new Map();
  private password: string | null = null;

  static getInstance(): EncryptedCache {
    if (!EncryptedCache.instance) {
      EncryptedCache.instance = new EncryptedCache();
    }
    return EncryptedCache.instance;
  }

  setPassword(password: string) {
    this.password = password;
  }

  clearPassword() {
    this.password = null;
    this.cache.clear();
  }

  // Cache decrypted data
  set(key: string, data: unknown) {
    this.cache.set(key, data);
  }

  // Get cached data
  get(key: string): unknown {
    return this.cache.get(key);
  }

  // Check if data exists in cache
  has(key: string): boolean {
    return this.cache.has(key);
  }

  // Clear specific cache entry
  delete(key: string) {
    this.cache.delete(key);
  }

  // Add new data to cache (for new entries)
  addToCache(key: string, newData: unknown) {
    const existingData = this.cache.get(key);
    if (Array.isArray(existingData)) {
      const updatedData = [...existingData, newData];
      this.cache.set(key, updatedData);
      return updatedData;
    } else {
      const updatedData = [newData];
      this.cache.set(key, updatedData);
      return updatedData;
    }
  }

  // Get current password
  getPassword(): string | null {
    return this.password;
  }

  // Clear all cache
  clear() {
    this.cache.clear();
  }
}
