import crypto from 'crypto';

const SECRET_KEY = process.env.ENCRYPTION_SECRET
  ? crypto.createHash('sha256').update(process.env.ENCRYPTION_SECRET).digest()
  : crypto.createHash('sha256').update(process.env.SUPABASE_SERVICE_ROLE_KEY || 'HotelGemaDefaultSecretKey2026!').digest();

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 16;

export function encryptData(plainText: string): string {
  if (!plainText) return '';

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);

  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');

  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

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

export function hashSensitiveCode(code: string, customSalt?: string): { hash: string; salt: string } {
  const salt = customSalt || crypto.randomBytes(SALT_LENGTH).toString('hex');
  const hash = crypto.createHmac('sha256', salt).update(code).digest('hex');
  return { hash, salt };
}

export function verifySensitiveCode(code: string, storedHash: string, salt: string): boolean {
  const { hash } = hashSensitiveCode(code, salt);
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(storedHash));
}
