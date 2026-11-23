import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { HardDrive, Cloud, WifiOff, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useConnectivity, setOnlineSyncEnabled } from '@/lib/offline/connectivity';
import { exportBackup, importBackup } from '@/lib/offline/backup';

export function OfflineControl() {
  const { online, sync } = useConnectivity();
  const fileRef = useRef<HTMLInputElement>(null);
  const label = !online ? 'Offline' : sync ? 'Online sync' : 'Local mode';
  const Icon = !online ? WifiOff : sync ? Cloud : HardDrive;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="rounded-xl" aria-label={`Storage: ${label}`}>
          <Icon className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">{label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-4">
        <div>
          <p className="font-semibold">Your data stays on this device</p>
          <p className="text-sm text-muted-foreground">Everything works without internet or paid services. Files you add are saved in this browser.</p>
        </div>
        <label className="flex items-center justify-between gap-3 text-sm">
          <span>Also save uploads online (optional)</span>
          <Switch checked={sync} onCheckedChange={setOnlineSyncEnabled} />
        </label>
        {sync && <p className="text-xs text-muted-foreground">If the online service is full or unreachable, files are saved on this device instead.</p>}
        <div className="flex gap-2">
          <Button size="sm" className="flex-1" onClick={() => exportBackup().then(() => toast.success('Backup downloaded')).catch(() => toast.error('Backup failed'))}>
            <Download className="w-4 h-4 mr-1" /> Backup
          </Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={() => fileRef.current?.click()}>
            <Upload className="w-4 h-4 mr-1" /> Restore
          </Button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={async (e) => {
            const f = e.target.files?.[0]; if (!f) return;
            try { await importBackup(f); toast.success('Backup restored — reloading'); setTimeout(() => location.reload(), 800); }
            catch (err) { toast.error(err instanceof Error ? err.message : 'Restore failed'); }
            e.target.value = '';
          }} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
