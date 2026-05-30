import { beforeEach, describe, expect, it } from 'bun:test';
import { MemoryKvAdapter, setKvAdapter } from './kv';
import { onboardingStorage } from './onboarding-storage';

describe('onboardingStorage', () => {
  beforeEach(() => {
    setKvAdapter(new MemoryKvAdapter());
  });

  describe('hasOnboarded', () => {
    it('should return false by default', () => {
      expect(onboardingStorage.hasOnboarded()).toBe(false);
    });

    it('should return true after setOnboarded(true)', () => {
      onboardingStorage.setOnboarded(true);
      expect(onboardingStorage.hasOnboarded()).toBe(true);
    });

    it('should return false after setOnboarded(false)', () => {
      onboardingStorage.setOnboarded(true);
      onboardingStorage.setOnboarded(false);
      expect(onboardingStorage.hasOnboarded()).toBe(false);
    });
  });

  describe('setOnboarded', () => {
    it('should persist the value', () => {
      onboardingStorage.setOnboarded(true);
      expect(onboardingStorage.hasOnboarded()).toBe(true);
    });
  });

  describe('completeOnboarding', () => {
    it('should set onboarded to true', () => {
      onboardingStorage.completeOnboarding();
      expect(onboardingStorage.hasOnboarded()).toBe(true);
    });
  });

  describe('resetOnboarding', () => {
    it('should remove onboarded flag', () => {
      onboardingStorage.completeOnboarding();
      onboardingStorage.resetOnboarding();
      expect(onboardingStorage.hasOnboarded()).toBe(false);
    });

    it('should not throw when called without prior onboarding', () => {
      expect(() => onboardingStorage.resetOnboarding()).not.toThrow();
    });
  });

  describe('full lifecycle', () => {
    it('should handle complete cycle: complete, has, reset', () => {
      expect(onboardingStorage.hasOnboarded()).toBe(false);
      onboardingStorage.completeOnboarding();
      expect(onboardingStorage.hasOnboarded()).toBe(true);
      onboardingStorage.resetOnboarding();
      expect(onboardingStorage.hasOnboarded()).toBe(false);
    });
  });
});
