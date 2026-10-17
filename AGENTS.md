# AGENTS.md

- Dashboard tools are grouped into three centers (Human, Collaborative, Agentic) defined in `src/components/dashboard/navigationClusters.ts`; each tool is defined once in `toolRegistry` with a home center and may be listed in sections of several centers; add new tools there and register their view in `DashboardTabs` — keeps navigation in one place for open-source contributors.
