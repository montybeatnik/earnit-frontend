import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

type Nullable<T> = T | null;

export type JwtPayload = {
  role?: string;
  user_id?: number;
  [key: string]: unknown;
};

const TOKEN_KEY = 'token';
const ROLE_KEY = 'role';

let secureStoreAvailable: Nullable<boolean> = null;

async function isSecureStoreAvailable(): Promise<boolean> {
  if (secureStoreAvailable !== null) return secureStoreAvailable;
  if (Platform.OS === 'web') {
    secureStoreAvailable = false;
    return false;
  }
  try {
    const available = SecureStore.isAvailableAsync ? await SecureStore.isAvailableAsync() : false;
    secureStoreAvailable = Boolean(available && typeof SecureStore.setItemAsync === 'function');
    if (!secureStoreAvailable) {
      console.warn('🔐 SecureStore unavailable, using AsyncStorage fallback');
    }
    return secureStoreAvailable;
  } catch (err) {
    console.warn('🔐 SecureStore availability check failed, falling back', err);
    secureStoreAvailable = false;
    return false;
  }
}

async function writeSecure(key: string, value: string) {
  const available = await isSecureStoreAvailable();
  if (!available) {
    await AsyncStorage.setItem(key, value);
    return;
  }
  try {
    await SecureStore.setItemAsync(key, value, {
      keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
    });
  } catch (err) {
    console.warn(`🔐 Failed to write ${key} to SecureStore, falling back`, err);
    await AsyncStorage.setItem(key, value);
  }
}

async function readSecure(key: string): Promise<Nullable<string>> {
  const available = await isSecureStoreAvailable();
  if (available) {
    try {
      const secureValue = await SecureStore.getItemAsync(key);
      if (secureValue) return secureValue;
    } catch (err) {
      console.warn(`🔐 Failed to read ${key} from SecureStore`, err);
    }
  }

  // Migrate any legacy AsyncStorage values into SecureStore
  try {
    const legacyValue = await AsyncStorage.getItem(key);
    if (legacyValue) {
      await writeSecure(key, legacyValue);
      await AsyncStorage.removeItem(key);
    }
    return legacyValue;
  } catch (err) {
    console.warn(`⚠️ Failed to read legacy ${key} from AsyncStorage`, err);
    return null;
  }
}

async function deleteSecure(key: string) {
  const available = await isSecureStoreAvailable();
  if (available) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (err) {
      console.warn(`🔐 Failed to delete ${key} from SecureStore`, err);
    }
  }

  try {
    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.warn(`⚠️ Failed to delete legacy ${key} from AsyncStorage`, err);
  }
}

export async function storeSession(token: string, role?: string) {
  await writeSecure(TOKEN_KEY, token);
  if (role) {
    await writeSecure(ROLE_KEY, role);
  }
}

export async function storeRole(role: string) {
  await writeSecure(ROLE_KEY, role);
}

export async function storeValue(key: string, value: string) {
  await writeSecure(key, value);
}

export async function getSession(): Promise<{ token: Nullable<string>; role: Nullable<string> }> {
  const [token, role] = await Promise.all([readSecure(TOKEN_KEY), readSecure(ROLE_KEY)]);
  return { token, role };
}

export async function clearSession() {
  await Promise.all([deleteSecure(TOKEN_KEY), deleteSecure(ROLE_KEY)]);
}

function base64Decode(input: string): string {
  // Prefer native atob when present
  if (typeof globalThis.atob === 'function') {
    return globalThis.atob(input);
  }

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let str = input.replace(/=+$/, '');
  let output = '';

  for (let bc = 0, bs = 0, buffer, idx = 0; (buffer = str.charAt(idx++));) {
    buffer = chars.indexOf(buffer);
    if (buffer === -1) continue;
    bs = bc % 4 ? bs * 64 + buffer : buffer;
    if (bc++ % 4) {
      output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6)));
    }
  }

  return output;
}

function decodeBase64Url(input: string): string {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return base64Decode(padded);
}

export function decodeJwtPayload(token: string | null): JwtPayload | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;

  try {
    const decoded = decodeBase64Url(parts[1]);
    return JSON.parse(decoded);
  } catch (err) {
    console.warn('❌ Failed to decode JWT payload', err);
    return null;
  }
}
