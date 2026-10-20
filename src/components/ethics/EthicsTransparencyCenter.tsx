import { useState } from 'react';
import {
  ShieldCheck, OctagonX, PlayCircle, Scale, Eye, Hand, CheckCircle2, XCircle, Clock, Trash2, Sprout,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { CORE_RULES } from '@/lib/safety/guardrails';
import { humanAlerts, safetyStore, useSafety, type SafetyEvent } from '@/lib/safety/safetyStore';

const statusStyle: Record<SafetyEvent['status'], string> = {
  allowed: 'bg-green-100 text-green-800',
  approved: 'bg-green-100 text-green-800',
  blocked: 'bg-red-100 text-red-800',
  rejected: 'bg-muted text-muted-foreground',
  pending: 'bg-amber-100 text-amber-800',
};

const principles = [
  { icon: Sprout, title: 'Constructive progress', text: 'Agents work towards helping people and the planet.' },
  { icon: Eye, title: 'Full transparency', text: 'Every check is logged with the reason, visible to humans.' },
  { icon: Hand, title: 'Humans decide', text: 'Risky or irreversible actions always wait for a person.' },
  { icon: Scale, title: 'Fair and honest', text: 'No deception, manipulation or discrimination.' },
];

export const EthicsTransparencyCenter = () => {
  const s = useSafety();
  const [agent, setAgent] = useState('Grant Writer Agent');
  const [action, setAction] = useState('');
  const [confidence, setConfidence] = useState(80);
  const [last, setLast] = useState<SafetyEvent | null>(null);
  const alerts = humanAlerts(s);
  const counts = {
    allowed: s.events.filter((e) => e.status === 'allowed' || e.status === 'approved').length,
    blocked: s.events.filter((e) => e.status === 'blocked').length,
    pending: s.events.filter((e) => e.status === 'pending').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-2xl font-bold">Ethics & Transparency Center</h2>
            <p className="text-muted-foreground">AI and humans together: safe, honest and constructive.</p>
          </div>
        </div>
        {s.paused ? (
          <Button onClick={() => safetyStore.setPaused(false)} className="bg-green-600 hover:bg-green-700">
            <PlayCircle className="mr-2 h-4 w-4" /> Resume all agents
          </Button>
        ) : (
          <Button variant="destructive" onClick={() => safetyStore.setPaused(true)}>
            <OctagonX className="mr-2 h-4 w-4" /> Emergency stop
          </Button>
        )}
      </div>

      {s.paused && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-800">
          <strong>Emergency stop is on.</strong> Every agent action is blocked until a human resumes.
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: 'Safety status', value: s.paused ? 'Paused' : 'Active', cls: s.paused ? 'text-red-600' : 'text-green-600' },
          { label: 'Allowed actions', value: counts.allowed, cls: 'text-green-600' },
          { label: 'Stopped automatically', value: counts.blocked, cls: 'text-red-600' },
          { label: 'Waiting for a human', value: counts.pending, cls: 'text-amber-600' },
        ].map((k) => (
          <Card key={k.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{k.label}</p>
              <p className={`text-2xl font-bold ${k.cls}`}>{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Check an agent action</CardTitle>
            <CardDescription>Every agent passes this gate before acting. Try it yourself.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input value={agent} onChange={(e) => setAgent(e.target.value)} aria-label="Agent name" />
            <Textarea
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="e.g. Send the donation report to all volunteers"
              aria-label="Planned action"
            />
            <div>
              <p className="mb-2 text-sm text-muted-foreground">Agent confidence: {confidence}%</p>
              <Slider value={[confidence]} min={0} max={100} step={5} onValueChange={(v) => setConfidence(v[0])} />
            </div>
            <Button
              disabled={!action.trim()}
              onClick={() => setLast(safetyStore.check({ agent, action, confidence: confidence / 100 }))}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white"
            >
              Run safety check
            </Button>
            {last && (
              <div className="rounded-lg border p-3 text-sm" role="status">
                <Badge className={statusStyle[last.status]}>{last.verdict.toUpperCase()}</Badge>
                <p className="mt-2">{last.reason}</p>
                {last.hits.map((h) => (
                  <p key={h.ruleId} className="text-xs text-muted-foreground">
                    {h.name} — matched “{h.match}”
                  </p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Human signals ({alerts.length})</CardTitle>
            <CardDescription>Automatic stops and approvals are sent here and to the Human Center.</CardDescription>
          </CardHeader>
          <CardContent className="max-h-96 space-y-2 overflow-auto">
            {alerts.length === 0 && <p className="text-sm text-muted-foreground">All clear. Nothing needs you right now.</p>}
            {alerts.map((e) => (
              <div key={e.id} className="rounded-lg border p-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{e.agent}</span>
                  <Badge className={statusStyle[e.status]}>{e.status}</Badge>
                </div>
                <p className="mt-1">{e.action}</p>
                <p className="text-xs text-muted-foreground">{e.reason}</p>
                <div className="mt-2 flex gap-2">
                  {e.status === 'pending' ? (
                    <>
                      <Button size="sm" onClick={() => safetyStore.decide(e.id, true)}>
                        <CheckCircle2 className="mr-1 h-4 w-4" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => safetyStore.decide(e.id, false)}>
                        <XCircle className="mr-1 h-4 w-4" /> Reject
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => safetyStore.acknowledge(e.id)}>
                      Acknowledge
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Core safety rules</CardTitle>
          <CardDescription>
            Built into the code itself, so they stay on for everyone who uses or copies this app.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {CORE_RULES.map((r) => (
            <div key={r.id} className="rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">{r.name}</span>
                <Badge variant={r.verdict === 'block' ? 'destructive' : 'secondary'}>
                  {r.verdict === 'block' ? 'Auto-stop' : 'Human approval'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{r.description}</p>
            </div>
          ))}
          <div className="rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Unsure agents ask first</span>
              <Badge variant="secondary">Human approval</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Confidence below 50% always goes to a human.</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-4">
        {principles.map((p) => (
          <Card key={p.title}>
            <CardContent className="p-4">
              <p.icon className="mb-2 h-5 w-5 text-purple-600" />
              <p className="font-medium">{p.title}</p>
              <p className="text-sm text-muted-foreground">{p.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Transparency log</CardTitle>
            <CardDescription>Every check, stored only on this device.</CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={() => safetyStore.clearLog()}>
            <Trash2 className="mr-1 h-4 w-4" /> Clear handled
          </Button>
        </CardHeader>
        <CardContent className="max-h-80 space-y-1 overflow-auto text-sm">
          {s.events.length === 0 && <p className="text-muted-foreground">No checks yet.</p>}
          {s.events.map((e) => (
            <div key={e.id} className="flex items-center gap-2 border-b py-1 last:border-0">
              <Clock className="h-3 w-3 shrink-0 text-muted-foreground" />
              <span className="w-36 shrink-0 text-xs text-muted-foreground">{new Date(e.at).toLocaleString()}</span>
              <span className="w-40 shrink-0 truncate font-medium">{e.agent}</span>
              <span className="flex-1 truncate">{e.action}</span>
              <Badge className={statusStyle[e.status]}>{e.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
