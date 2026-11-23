import { supabase } from '@/integrations/supabase/client';
import { localDb } from './localDb';
import { chooseStorage, shouldFallBackToLocal, StorageTarget } from './storagePolicy';
import { isOnlineSyncEnabled } from './connectivity';

const BUCKET = 'media-files';

/** Saves a file on this device by default; online only when the user turned sync on. */
export async function saveMedia(path: string, file: Blob): Promise<{ url: string; storage: StorageTarget }> {
  const target = chooseStorage({ onlineEnabled: isOnlineSyncEnabled(), isOnline: navigator.onLine, size: file.size });
  if (target === 'online') {
    try {
      const { error } = await supabase.storage.from(BUCKET).upload(path, file);
      if (error) throw error;
      return { url: supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl, storage: 'online' };
    } catch (e) {
      if (!shouldFallBackToLocal(e)) throw e;
      console.warn('Online storage unavailable, saved on this device instead.', e);
    }
  }
  await localDb.put(path, file);
  return { url: URL.createObjectURL(file), storage: 'local' };
}

export async function removeMedia(path: string): Promise<void> {
  await localDb.remove(path).catch(() => undefined);
  if (isOnlineSyncEnabled() && navigator.onLine) {
    await supabase.storage.from(BUCKET).remove([path]).catch(() => undefined);
  }
}
