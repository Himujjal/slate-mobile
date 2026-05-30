import { kv } from './kv';

const ONBOARDED_KEY = 'onboarding_completed';

export const onboardingStorage = {
  hasOnboarded(): boolean {
    return kv.getBoolean(ONBOARDED_KEY) ?? false;
  },

  setOnboarded(value: boolean): void {
    kv.setBoolean(ONBOARDED_KEY, value);
  },

  completeOnboarding(): void {
    this.setOnboarded(true);
  },

  resetOnboarding(): void {
    kv.remove(ONBOARDED_KEY);
  },
};

export type OnboardingStorage = typeof onboardingStorage;
