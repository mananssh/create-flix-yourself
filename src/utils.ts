import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';

export function generateSecret(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

export function isValidProjectName(name: string): boolean {
  return /^[a-z0-9-_]+$/i.test(name);
}

export function sanitizeProjectName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '');
}

export function getDirName(importMetaUrl: string): string {
  return path.dirname(fileURLToPath(importMetaUrl));
}

export async function directoryExists(dirPath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(dirPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

export async function isDirectoryEmpty(dirPath: string): Promise<boolean> {
  try {
    const files = await fs.readdir(dirPath);
    return files.length === 0;
  } catch {
    return true;
  }
}

export function detectPackageManager(): 'npm' | 'pnpm' | 'yarn' {
  const userAgent = process.env.npm_config_user_agent || '';
  
  if (userAgent.includes('pnpm')) {
    return 'pnpm';
  } else if (userAgent.includes('yarn')) {
    return 'yarn';
  }
  
  return 'npm';
}
