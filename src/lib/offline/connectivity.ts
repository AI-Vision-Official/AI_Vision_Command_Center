import { useEffect, useState } from 'react';

const KEY = 'aivision-online-sync';
const EVT = 'aivision-connectivity';

export const isOnlineSyncEnabled = () => localStorage.getItem(KEY) === 'on';
export const setOnlineSyncEnabled = (on: boolean) => {
  localStorage.setItem(KEY, on ? 'on' : 'off');
  window.dispatchEvent(new Event(EVT));
};

export function useConnectivity() {
  const [state, setState] = useState(() => ({ online: navigator.onLine, sync: isOnlineSyncEnabled() }));
  useEffect(() => {
    const update = () => setState({ online: navigator.onLine, sync: isOnlineSyncEnabled() });
    ['online', 'offline', EVT].forEach((e) => window.addEventListener(e, update));
    return () => ['online', 'offline', EVT].forEach((e) => window.removeEventListener(e, update));
  }, []);
  return state;
}
