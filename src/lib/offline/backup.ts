import { localDb } from './localDb';

const blobToDataUrl = (b: Blob) => new Promise<string>((res, rej) => {
  const r = new FileReader(); r.onload = () => res(r.result as string); r.onerror = () => rej(r.error); r.readAsDataURL(b);
});

/** Downloads all app data (settings + media saved on this device) as one file. */
export async function exportBackup() {
  const settings: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)!;
    if (k.startsWith('sb-')) continue; // never export login tokens
    settings[k] = localStorage.getItem(k) ?? '';
  }
  const media: Record<string, string> = {};
  for (const key of await localDb.keys()) {
    const blob = await localDb.get(String(key));
    if (blob) media[String(key)] = await blobToDataUrl(blob);
  }
  const data = JSON.stringify({ app: 'ai-vision', version: 1, created: new Date().toISOString(), settings, media });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
  a.download = `ai-vision-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export async function importBackup(file: File) {
  const data = JSON.parse(await file.text());
  if (data?.app !== 'ai-vision') throw new Error('This is not an AI Vision backup file.');
  Object.entries(data.settings ?? {}).forEach(([k, v]) => localStorage.setItem(k, String(v)));
  for (const [k, url] of Object.entries<string>(data.media ?? {})) {
    await localDb.put(k, await (await fetch(url)).blob());
  }
}
