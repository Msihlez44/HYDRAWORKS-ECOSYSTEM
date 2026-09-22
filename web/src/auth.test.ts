import { describe, expect, it } from 'vitest';
import { registerSchema } from '../../src/auth.js';

describe('HYDRA ID validation', () => {
  it('accepts a strong valid registration', () => {
    expect(registerSchema.parse({
      firstName: 'Hydra',
      lastName: 'Owner',
      email: 'owner@example.co.za',
      phone: '+27820000000',
      password: 'StrongPass2026',
      role: 'BUSINESS_OWNER'
    }).role).toBe('BUSINESS_OWNER');
  });
  it('rejects weak registrations', () => {
    expect(() => registerSchema.parse({
      firstName: 'A',
      lastName: 'B',
      email: 'bad',
      phone: '1',
      password: 'weak'
    })).toThrow();
  });
});
