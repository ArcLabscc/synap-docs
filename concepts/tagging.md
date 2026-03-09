# Tagging System

Thoughts are categorized using `[TAG]` prefixes in the content. This is a lightweight convention — no rigid schema, just a prefix that helps with search and organization.

## Tags

| Tag | Purpose | Example |
|-----|---------|---------|
| `[DECISION]` | Architectural or strategic choices | `[DECISION] Use Rust for server (2026-01-15): Performance and safety...` |
| `[PATTERN]` | Reusable learnings | `[PATTERN] Always serialize SurrealDB queries...` |
| `[INSIGHT]` | Key realizations | `[INSIGHT] Privacy-by-architecture is the wedge...` |
| `[TASK]` | Action items | `[TASK] Set up SSL for api.synap.ing` |
| `[QUESTION]` | Open questions | `[QUESTION] Should we use OAuth or API keys?` |
| `[SESSION]` | Work summaries | `[SESSION] Built MCP server and docs site...` |
| `[RESEARCH]` | Prior art findings | `[RESEARCH] Existing knowledge graph tools...` |
| `[STRATEGY]` | Strategic direction | `[STRATEGY] Cloud-first, local-optional...` |
| `[MILESTONE]` | Significant completions | `[MILESTONE] v3 migration complete...` |

## Date convention

Include a date in the content for temporal context:

```
[TAG] Title (YYYY-MM-DD): Detailed content...
```

This helps when searching for "decisions from last month" or "what changed this week."

## Searching by tag

Use keyword search to filter by tag:

```
"Search my ARX for all [DECISION] thoughts"
"Find [TASK] items that are still open"
```
