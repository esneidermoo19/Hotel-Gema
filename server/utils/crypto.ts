/**
 * server/utils/crypto.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Módulo de encriptación y seguridad para Hotel Gema PMS.
 *
 * Utiliza AES-256-GCM (Authenticated Encryption con algoritmo Galois/Counter Mode)
 * para cifrar datos sensibles de huéspedes, documentos o tarjetas en reposo,
 * y SHA-256 con Salt para hash de PINs/claves.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import crypto from 'crypto';

// Clave secreta de encriptación (32 bytes para AES-256)
const SECRET_KEY = process.env.ENCRYPTION_SECRET 
  ? crypto.createHash('sha256').update(process.env.ENCRYPTION_SECRET).digest()
  : crypto.createHash('sha256').update(process.env.SUPABASE_SERVICE_ROLE_KEY || 'HotelGemaDefaultSecretKey2026!').digest();

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // 128 bits
const SALT_LENGTH = 16;

/**
 * Cifra una cadena de texto usando AES-256-GCM.
 * Retorna el resultado formateado como "iv:authTag:encryptedData" (en formato Hex).
 */
export function encryptData(plainText: string): string {
  if (!plainText) return '';
  
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
  
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag().toString('hex');
  
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Descifra una cadena formateada como "iv:authTag:encryptedData".
 */
export function decryptData(cipherText: string): string {
  if (!cipherText || !cipherText.includes(':')) return cipherText;

  try {
    const [ivHex, authTagHex, encryptedHex] = cipherText.split(':');
    if (!ivHex || !authTagHex || !encryptedHex) return cipherText;

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
    
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('[Crypto] Error al descifrar dato:', error);
    return '[Dato Protegido / Error de Descifrado]';
  }
}

/**
 * Genera un hash seguro para PINs o contraseñas locales (SHA-256 con Salt).
 */
export function hashSensitiveCode(code: string, customSalt?: string): { hash: string; salt: string } {
  const salt = customSalt || crypto.randomBytes(SALT_LENGTH).toString('hex');
  const hash = crypto.createHmac('sha256', salt).update(code).digest('hex');
  return { hash, salt };
}

/**
 * Verifica un código (PIN o clave) contra su hash y salt guardados.
 */
export function verifySensitiveCode(code: string, storedHash: string, salt: string): boolean {
  const { hash } = hashSensitiveCode(code, salt);
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(storedHash));
}
