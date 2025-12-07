import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearSession, decodeJwtPayload, getSession, storeSession } from '../services/session';

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
  AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY: 'after_first_unlock_this_device_only',
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;
const mockAsyncStorage = AsyncStorage as unknown as jest.Mocked<typeof AsyncStorage>;

const samplePayload = { role: 'parent', user_id: 42 };
const sampleToken = [
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', // header
  Buffer.from(JSON.stringify(samplePayload)).toString('base64url'),
  'signature',
].join('.');

beforeEach(() => {
  jest.resetAllMocks();
});

describe('session helpers', () => {
  it('decodes a valid JWT payload', () => {
    const payload = decodeJwtPayload(sampleToken);
    expect(payload).toMatchObject(samplePayload);
  });

  it('returns null for malformed tokens', () => {
    expect(decodeJwtPayload('not.a.jwt')).toBeNull();
    expect(decodeJwtPayload(null)).toBeNull();
  });

  it('persists session tokens into SecureStore', async () => {
    await storeSession('abc123', 'child');
    expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith(
      'token',
      'abc123',
      expect.any(Object)
    );
    expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith(
      'role',
      'child',
      expect.any(Object)
    );
  });

  it('migrates legacy AsyncStorage values when SecureStore is empty', async () => {
    mockSecureStore.getItemAsync.mockResolvedValueOnce(null);
    mockSecureStore.getItemAsync.mockResolvedValueOnce(null);
    mockAsyncStorage.getItem = jest.fn()
      .mockResolvedValueOnce('legacy-token')
      .mockResolvedValueOnce('legacy-role');

    const session = await getSession();

    expect(session).toEqual({ token: 'legacy-token', role: 'legacy-role' });
    expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith(
      'token',
      'legacy-token',
      expect.any(Object)
    );
    expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith(
      'role',
      'legacy-role',
      expect.any(Object)
    );
  });

  it('clears session from both stores', async () => {
    await clearSession();
    expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('token');
    expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('role');
    expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('token');
    expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('role');
  });
});
