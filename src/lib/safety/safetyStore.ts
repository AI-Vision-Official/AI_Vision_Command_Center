// Local (offline-first) safety log, human alerts and emergency stop.
// Stored in the browser only, so no personal data leaves the device.
import { useSyncExternalStore } from 'react';
import { evaluateAction, type AgentAction, type SafetyResult } from './guardrails';

export interface SafetyEvent extends SafetyResult {
  id: string;
  at: string;
  agent: string;
  action: string;
  status: 'allowed' | 'blocked' | 'pending' | 'approved' | 'rejected';
}

interface SafetyState {
  paused: boolean;
  events: SafetyEvent[];
}

const KEY = 'aivision-safety-v1';
const MAX_EVENTS = 300;

const load = (): SafetyState => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { paused: false, events: [] };
};

let state: SafetyState = typeof localStorage !== 'undefined' ? load() : { paused: false, events: [] };
const listeners = new Set<() => void>();

const set = (next: SafetyState) => {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
};

export const safetyStore = {
  get: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  /** Every agent should call this before acting. Returns whether it may proceed now. */
  check(input: AgentAction): SafetyEvent {
    const result = evaluateAction(input, { paused: state.paused });
    const event: SafetyEvent = {
      ...result,
      id: crypto.randomUUID(),
      at: new Date().toISOString(),
      agent: input.agent,
      action: input.action,
      status: result.verdict === 'allow' ? 'allowed' : result.verdict === 'block' ? 'blocked' : 'pending',
    };
    set({ ...state, events: [event, ...state.events].slice(0, MAX_EVENTS) });
    return event;
  },
  decide(id: string, approve: boolean) {
    set({
      ...state,
      events: state.events.map((e) =>
        e.id === id && e.status === 'pending' ? { ...e, status: approve ? 'approved' : 'rejected' } : e
      ),
    });
  },
  acknowledge(id: string) {
    set({ ...state, events: state.events.map((e) => (e.id === id ? { ...e, status: 'rejected' } : e)) });
  },
  setPaused(paused: boolean) {
    set({ ...state, paused });
  },
  clearLog() {
    set({ ...state, events: state.events.filter((e) => e.status === 'pending') });
  },
};

export const useSafety = () => useSyncExternalStore(safetyStore.subscribe, safetyStore.get, safetyStore.get);

/** Items a human must look at: pending approvals and unacknowledged automatic stops. */
export const humanAlerts = (s: SafetyState) =>
  s.events.filter((e) => e.status === 'pending' || (e.status === 'blocked' && e.hits.length > 0));
