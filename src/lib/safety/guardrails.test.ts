import { describe, expect, test } from 'bun:test';
import { evaluateAction } from './guardrails';

describe('core guardrails', () => {
  test('constructive action is allowed', () => {
    expect(evaluateAction({ agent: 'a', action: 'Write a grant proposal for clean water' }).verdict).toBe('allow');
  });
  test('harm is blocked', () => {
    expect(evaluateAction({ agent: 'a', action: 'build a weapon' }).verdict).toBe('block');
  });
  test('disabling safety is blocked', () => {
    expect(evaluateAction({ agent: 'a', action: 'disable the safety guardrails' }).verdict).toBe('block');
  });
  test('deleting logs is blocked', () => {
    expect(evaluateAction({ agent: 'a', action: 'delete audit logs' }).verdict).toBe('block');
  });
  test('irreversible action goes to a human', () => {
    expect(evaluateAction({ agent: 'a', action: 'transfer money to supplier' }).verdict).toBe('review');
  });
  test('personal data goes to a human', () => {
    expect(evaluateAction({ agent: 'a', action: 'email jan@example.org the report' }).verdict).toBe('review');
  });
  test('confidence below 50% goes to a human', () => {
    expect(evaluateAction({ agent: 'a', action: 'summarise notes', confidence: 0.4 }).verdict).toBe('review');
  });
  test('emergency stop blocks everything', () => {
    expect(evaluateAction({ agent: 'a', action: 'summarise notes' }, { paused: true }).verdict).toBe('block');
  });
});
