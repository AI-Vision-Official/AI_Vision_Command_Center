import { describe, expect, test } from 'bun:test';
import { chooseStorage, shouldFallBackToLocal } from './storagePolicy';

describe('offline-first storage', () => {
  test('local by default when online sync is off', () => {
    expect(chooseStorage({ onlineEnabled: false, isOnline: true, size: 10 })).toBe('local');
  });
  test('local when the device has no internet', () => {
    expect(chooseStorage({ onlineEnabled: true, isOnline: false, size: 10 })).toBe('local');
  });
  test('online only when sync is on and connected', () => {
    expect(chooseStorage({ onlineEnabled: true, isOnline: true, size: 10 })).toBe('online');
  });
  test('files over 50 MB stay local', () => {
    expect(chooseStorage({ onlineEnabled: true, isOnline: true, size: 51 * 1024 * 1024 })).toBe('local');
  });
  test('an online limit error falls back to local', () => {
    expect(shouldFallBackToLocal({ statusCode: 402, message: 'quota exceeded' })).toBe(true);
  });
});
