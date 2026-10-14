// Open-source agent skills. Each entry keeps its original author, repository and license
// so credit stays visible in the app. Add new skills here.

export type SkillCategory = 'Reverse Engineering' | 'Code Intelligence' | 'Performance' | 'Reasoning' | 'Mathematics' | 'Contribution';

export interface AgentSkill {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: SkillCategory;
  author: string;
  authorUrl: string;
  repoUrl: string;
  website?: string;
  license: string;
  install: string;
  featured?: boolean;
}

const MORLUTO = { author: 'Morluto', authorUrl: 'https://github.com/morluto' };

export const agentSkills: AgentSkill[] = [
  {
    id: 'rea',
    name: 'REA — Reverse Engineer Anything',
    tagline: 'One MCP for reverse engineering across binaries, apps and runtime behavior.',
    description: 'See a feature you like and let agents understand how it works, down to the binary level. Works with tools such as Hopper and Ghidra through a single MCP server.',
    category: 'Reverse Engineering',
    ...MORLUTO,
    repoUrl: 'https://github.com/morluto/rea',
    website: 'https://rea.tools/',
    license: 'MIT',
    install: 'npx rea-agents setup',
    featured: true,
  },
  {
    id: 'leantoken',
    name: 'LeanToken',
    tagline: 'Code intelligence that keeps context windows and tokens lean.',
    description: 'Helps agents find the code that matters in a large codebase, so they read less and spend fewer tokens.',
    category: 'Code Intelligence',
    ...MORLUTO,
    repoUrl: 'https://github.com/morluto/leantoken',
    license: 'MIT OR Apache-2.0',
    install: 'npx leantoken setup',
  },
  {
    id: 'flameox',
    name: 'Flameox',
    tagline: 'Runtime evidence to trace, profile and burn down hotspots.',
    description: 'Coordinates profilers, benchmarks and trace tools for app code, native code, GPU kernels and inference stacks — and records what it observed.',
    category: 'Performance',
    ...MORLUTO,
    repoUrl: 'https://github.com/morluto/flameox',
    license: 'MIT',
    install: 'npx flameox@latest setup',
  },
  {
    id: 'internalcot',
    name: 'internalcot',
    tagline: 'Make agents show their full chain of thought.',
    description: 'An opt-in reasoning workspace for Codex and Claude Code: the agent writes its decomposition, evidence and alternatives as readable notes — useful for human oversight.',
    category: 'Reasoning',
    ...MORLUTO,
    repoUrl: 'https://github.com/morluto/internalcot',
    license: 'MIT',
    install: 'npx internalcot@latest setup',
  },
  {
    id: 'jacobian',
    name: 'Jacobian',
    tagline: 'Composable mathematics tools for agents.',
    description: 'A searchable vocabulary of typed math operations: agents find one operation, run it, and combine the results. Also available as CLI and Python library.',
    category: 'Mathematics',
    ...MORLUTO,
    repoUrl: 'https://github.com/morluto/jacobian',
    license: 'MIT',
    install: 'npx jacobian@latest setup',
  },
  {
    id: 'gitcontribute',
    name: 'GitContribute',
    tagline: 'Contribution research before writing a patch.',
    description: 'Checks repository guidance, related issues and pull requests, code context and validation. Never writes to GitHub — prepares drafts for you to review.',
    category: 'Contribution',
    ...MORLUTO,
    repoUrl: 'https://github.com/morluto/gitcontribute',
    license: 'MIT',
    install: 'npx --yes gitcontribute@latest setup',
  },
];
