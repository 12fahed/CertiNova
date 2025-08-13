import crypto from 'crypto';

/**
 * Encrypts data using AES-256-CBC with PBKDF2 key derivation
 */
export function encryptData(data, password) {
  try {
    // Convert data to JSON string
    const jsonString = JSON.stringify(data);
    
    // Generate random salt and IV
    const salt = crypto.randomBytes(16).toString('hex'); // 16 bytes = 32 hex chars
    const iv = crypto.randomBytes(16); // 16 bytes for AES
    
    // Derive key from password using PBKDF2
    const key = crypto.pbkdf2Sync(password, salt, 10000, 32, 'sha256'); // 32 bytes = 256 bits
    
    // Create cipher with IV
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    
    // Encrypt the data
    let encrypted = cipher.update(jsonString, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
      encryptedData: encrypted,
      salt: salt,
      iv: iv.toString('hex')
    };
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypts data using AES-256-CBC with PBKDF2 key derivation
 */
export function decryptData(encryptedPackage, password) {
  try {
    const { encryptedData, salt, iv } = encryptedPackage;
    
    // Derive the same key from password and salt
    const key = crypto.pbkdf2Sync(password, salt, 10000, 32, 'sha256');
    
    // Create decipher
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));
    
    // Decrypt the data
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    // Parse JSON string back to object
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data. Invalid password or corrupted data.');
  }
}

/**
 * Creates a SHA-256 hash of the password
 */
export function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}
