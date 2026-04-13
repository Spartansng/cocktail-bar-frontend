import { describe, it, expect } from 'vitest';
import { validateIdentifier, validatePassword, getIdentifierError, getPasswordError } from '../src/utils/validators';

describe('validateIdentifier', () => {
  it('accepts 8-12 alphanumeric chars', () => {
    expect(validateIdentifier('abcdefgh')).toBe(true);
    expect(validateIdentifier('abc12345')).toBe(true);
    expect(validateIdentifier('ABCDEFGHIJKL')).toBe(true);
  });

  it('rejects too short', () => {
    expect(validateIdentifier('abcd')).toBe(false);
  });

  it('rejects too long', () => {
    expect(validateIdentifier('abcdefghijklm')).toBe(false);
  });

  it('rejects special characters', () => {
    expect(validateIdentifier('abcde@gh')).toBe(false);
  });
});

describe('validatePassword', () => {
  it('accepts valid password', () => {
    expect(validatePassword('Password123!xx')).toBe(true);
  });

  it('rejects too short', () => {
    expect(validatePassword('Pass1!')).toBe(false);
  });

  it('rejects without uppercase', () => {
    expect(validatePassword('password123!xx')).toBe(false);
  });

  it('rejects without digit', () => {
    expect(validatePassword('Passwordxxxx!x')).toBe(false);
  });

  it('rejects without special char', () => {
    expect(validatePassword('Password1234xx')).toBe(false);
  });
});

describe('getIdentifierError', () => {
  it('returns null for valid', () => {
    expect(getIdentifierError('abcdefgh')).toBeNull();
  });

  it('returns error for empty', () => {
    expect(getIdentifierError('')).toBeTruthy();
  });
});

describe('getPasswordError', () => {
  it('returns null for valid', () => {
    expect(getPasswordError('Password123!xx')).toBeNull();
  });

  it('returns error for empty', () => {
    expect(getPasswordError('')).toBeTruthy();
  });
});
