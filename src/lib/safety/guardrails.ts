// Core safety guardrails for every agent action.
// These rules are part of the code base on purpose: anyone who forks or reuses this app
// gets the same baseline protection. Projects may ADD rules, but core rules cannot be
// switched off from the UI (see SAFETY.md).

export type Verdict = 'allow' | 'review' | 'block';
export type Severity = 'info' | 'warning' | 'critical';

export interface SafetyRule {
  id: string;
  name: string;
  description: string;
  verdict: Exclude<Verdict, 'allow'>;
  severity: Severity;
  patterns: RegExp[];
  core: true;
}

export interface AgentAction {
  agent: string;
  action: string;
  /** 0..1, how sure the agent is. Below 0.5 always goes to a human. */
  confidence?: number;
}

export interface RuleHit {
  ruleId: string;
  name: string;
  verdict: Exclude<Verdict, 'allow'>;
  severity: Severity;
  match: string;
}

export interface SafetyResult {
  verdict: Verdict;
  hits: RuleHit[];
  reason: string;
}

export const CORE_RULES: SafetyRule[] = [
  {
    id: 'harm',
    name: 'No harm to people',
    description: 'Blocks violence, weapons, self-harm instructions and targeting of people.',
    verdict: 'block',
    severity: 'critical',
    core: true,
    patterns: [
      /\b(kill|murder|attack|hurt|poison|bomb|explosive|weapon|shoot|stalk|harass|self[- ]harm|suicide method)\w*/i,
    ],
  },
  {
    id: 'safety-bypass',
    name: 'No bypassing of safety',
    description: 'Blocks attempts to disable guardrails, hide activity, gain extra permissions or copy itself.',
    verdict: 'block',
    severity: 'critical',
    core: true,
    patterns: [
      /\b(disable|bypass|turn off|ignore|remove)\b.{0,30}\b(safety|guardrail|rules?|oversight|monitor|logs?|audit)/i,
      /\b(delete|erase|hide|wipe)\b.{0,20}\b(logs?|audit|traces?|history)/i,
      /\b(escalate|grant|give)\b.{0,20}\b(admin|root|privileges?|permissions?)/i,
      /\b(self[- ]?replicat|copy itself|spawn unlimited)/i,
    ],
  },
  {
    id: 'deception',
    name: 'No deception or manipulation',
    description: 'Blocks scams, impersonation, phishing, fake news and manipulation.',
    verdict: 'block',
    severity: 'critical',
    core: true,
    patterns: [/\b(phishing|scam|impersonat|deceive|manipulat|fake (news|reviews?|identity)|disinformation|fraud)\w*/i],
  },
  {
    id: 'privacy',
    name: 'Protect personal data',
    description: 'Personal data (emails, phone numbers, bank or ID numbers) needs a human to approve.',
    verdict: 'review',
    severity: 'warning',
    core: true,
    patterns: [
      /[\w.+-]+@[\w-]+\.[\w.]{2,}/,
      /(\+|00)\d{1,3}[\s-]?\d{2,4}[\s-]?\d{3,}/,
      /\b[A-Z]{2}\d{2}[A-Z]{4}\d{8,}\b/,
      /\b(password|passport|social security|bsn|credit card)\b/i,
    ],
  },
  {
    id: 'irreversible',
    name: 'Irreversible actions need a human',
    description: 'Deleting, paying, publishing or mass-sending always waits for human approval.',
    verdict: 'review',
    severity: 'warning',
    core: true,
    patterns: [
      /\b(delete|drop|destroy|wipe)\b.{0,20}\b(all|database|account|files?|users?)/i,
      /\b(transfer|pay|send)\b.{0,20}\b(money|funds|payment|€|\$|eur|usd)/i,
      /\b(publish|post|send)\b.{0,20}\b(to all|everyone|mass|public(ly)?)\b/i,
      /\b(sign|accept)\b.{0,20}\b(contract|agreement)/i,
    ],
  },
];

export function evaluateAction(input: AgentAction, opts: { paused?: boolean } = {}): SafetyResult {
  if (opts.paused) {
    return {
      verdict: 'block',
      hits: [],
      reason: 'Emergency stop is active: all agent actions are paused until a human resumes them.',
    };
  }

  const hits: RuleHit[] = [];
  for (const rule of CORE_RULES) {
    for (const p of rule.patterns) {
      const m = input.action.match(p);
      if (m) {
        hits.push({ ruleId: rule.id, name: rule.name, verdict: rule.verdict, severity: rule.severity, match: m[0] });
        break;
      }
    }
  }

  if (typeof input.confidence === 'number' && input.confidence < 0.5) {
    hits.push({
      ruleId: 'low-confidence',
      name: 'Low confidence',
      verdict: 'review',
      severity: 'info',
      match: `${Math.round(input.confidence * 100)}%`,
    });
  }

  const verdict: Verdict = hits.some((h) => h.verdict === 'block')
    ? 'block'
    : hits.length
      ? 'review'
      : 'allow';

  const reason =
    verdict === 'allow'
      ? 'No rules triggered. The action is constructive and may proceed.'
      : verdict === 'block'
        ? `Stopped automatically: ${hits.filter((h) => h.verdict === 'block').map((h) => h.name).join(', ')}.`
        : `Waiting for a human: ${hits.map((h) => h.name).join(', ')}.`;

  return { verdict, hits, reason };
}
