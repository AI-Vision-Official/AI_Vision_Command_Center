# Safety & Ethics Policy

AI Vision Command Center is built so that AI and humans move forward together, safely.
This policy applies to everyone who uses, forks or redistributes this project.

## Built-in guarantees
1. **Safety gate:** every agent action passes `safetyStore.check()` (`src/lib/safety/`) before it runs.
2. **Automatic stop:** harm to people, bypassing safety, deleting logs, gaining permissions, self-replication, deception and manipulation are blocked automatically.
3. **Human approval:** personal data, irreversible actions (deleting, paying, publishing to everyone, signing) and agents with confidence below 50% wait for a human.
4. **Human signal:** every stop or pending approval shows a red alert at the top of the app, in every center.
5. **Emergency stop:** one button pauses all agents until a human resumes them.
6. **Transparency:** every check is logged with its reason, stored locally on the device.

## Rules for contributors
- Core rules in `src/lib/safety/guardrails.ts` may be **extended, never weakened or removed**.
- Pull requests that weaken a core rule or remove a test in `guardrails.test.ts` will not be merged.
- New agents must call the safety gate; agents that bypass it are not accepted.
- Run `bun test ./src/lib/safety` before opening a pull request.

## Reporting
Found a way around the safeguards? Please open a private security advisory on GitHub instead of a public issue.
