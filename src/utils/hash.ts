import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function hashIpAddress(ip: string): string {
  const salt = 'emp_api_ip_privacy_salt_2026';
  return crypto.createHash('sha256').update(ip + salt).digest('hex');
}
