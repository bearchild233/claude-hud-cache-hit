# Claude HUD Cache Hit

A Claude Code statusline plugin based on [claude-hud](https://github.com/jarrodwatts/claude-hud). It adds cache-hit metrics while retaining context health, tool activity, agents, todos, and usage indicators.

## Highlights

- Context row shows cumulative token totals.
- Shows current-request and session-average cache-hit rates.
- Uses `CLAUDE_STATUS_FILE.cacheHitPercent` when available, with transcript totals as a fallback.
- Hides the misleading prompt-cache countdown by default.
- Uses its own configuration and cache directory, so it can coexist with the upstream Claude HUD plugin.

Example:

```text
Context █████░░░░░ 45% Tokens 20.3M (in: 14.6M, out: 14k, cache: 5.7M) hit 70.00%·avg 76.50%
```

## Install After Publishing

Replace `REPLACE_BEFORE_RELEASE/claude-hud-cache-hit` with the repository you publish.

```text
/plugin marketplace add REPLACE_BEFORE_RELEASE/claude-hud-cache-hit
/plugin install claude-hud-cache-hit@claude-hud-cache-hit
/reload-plugins
/claude-hud-cache-hit:setup
```

The setup command writes a dynamic statusline command that selects the latest installed plugin version. It preserves and backs up an existing statusline before replacing it.

## Configuration

The fork stores configuration in:

```text
~/.claude/plugins/claude-hud-cache-hit/config.json
```

Recommended settings:

```json
{
  "display": {
    "showSessionTokens": true,
    "showCacheHitRate": true,
    "showPromptCache": false
  }
}
```

- `showSessionTokens` displays cumulative tokens on the Context row.
- `showCacheHitRate` displays `hit` and `avg` values on the same row.
- `showPromptCache` controls the original `Cache ⏱ expired` countdown; this fork defaults it to `false`.

The cache-hit formula is:

```text
cache_read / (input + cache_creation + cache_read) * 100
```

The current value uses the latest statusline input. The average prefers Claude Code's status file and falls back to transcript session totals.

## Migrating From Earlier HUD Setups

`/claude-hud-cache-hit:setup` detects an existing upstream `claude-hud` statusline or the prior manual `claude-hud-custom` statusline. It offers to migrate display settings into this fork's separate directory without changing or deleting the old plugin's configuration.

Only one Claude Code `statusLine.command` can be active at a time. Both plugins can remain installed, but setup asks before replacing another active statusline.

## Development

```bash
npm ci
npm run build
npm test
```

`dist/` is intentionally part of the repository because Claude Code needs `dist/index.js` immediately after marketplace installation and does not build the plugin during install.

Before publishing, replace the placeholder publisher/repository fields in `package.json`, `.claude-plugin/plugin.json`, and `.claude-plugin/marketplace.json`.

## Attribution

This independent fork is based on [jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud), licensed under MIT. See [UPSTREAM.md](UPSTREAM.md) and [LICENSE](LICENSE).
