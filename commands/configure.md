---
description: Configure Claude HUD Cache Hit display options
allowed-tools: Read, Write, AskUserQuestion
---

# Configure Claude HUD Cache Hit

Read and update only `${CLAUDE_CONFIG_DIR:-~/.claude}/plugins/claude-hud-cache-hit/config.json`. Never modify the official `claude-hud` configuration.

If the new config does not exist, offer to import settings from `plugins/claude-hud/config.json` or `plugins/claude-hud-custom/config.json`. Preserve unknown settings when writing.

Use AskUserQuestion to offer these display controls:

- Context bar: `display.showContextBar`
- Token totals on the Context row: `display.showSessionTokens`
- Current/session-average cache hit rates on the Context row: `display.showCacheHitRate`
- Prompt-cache countdown: `display.showPromptCache`
- Tools, agents, todos, duration, config counts, session name, and usage limits
- Layout and language

Explain cache metrics:

- Current hit rate is calculated from the latest status-line stdin usage.
- Session average prefers `CLAUDE_STATUS_FILE.cacheHitPercent` and falls back to transcript totals.
- The rate is `cache_read / (input + cache_creation + cache_read)`.
- Token totals and cache-hit metrics share the Context row in expanded layout.

Recommended defaults for this fork:

```json
{
  "display": {
    "showSessionTokens": true,
    "showCacheHitRate": true,
    "showPromptCache": false
  }
}
```

Before saving, show a summary. Write atomically as JSON, keep a valid existing config intact on cancellation, and confirm that Claude Code reflects display changes on the next status-line refresh.
