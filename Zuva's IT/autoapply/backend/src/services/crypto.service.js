const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const KEY = crypto.scryptSync(
  process.env.ENCRYPTION_KEY || 'zuva-it-default-key-change-in-production',
  'salt',
  32,
);

function encryptData(data) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(data, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return { encryptedData: encrypted, iv: iv.toString('hex') };
}

function decryptData(encryptedData, ivHex) {
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { encryptData, decryptData };
