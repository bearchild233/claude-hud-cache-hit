---
description: Configure Claude HUD Cache Hit as the statusline
allowed-tools: Bash, Read, Edit, AskUserQuestion
---

# Setup Claude HUD Cache Hit

Configure the installed `claude-hud-cache-hit` plugin as Claude Code's status line. Do not edit plugin registries such as `installed_plugins.json` or remove other plugins.

## 1. Find the installed runtime

Set `CLAUDE_DIR` to `${CLAUDE_CONFIG_DIR:-$HOME/.claude}`. Find the highest semantic-version directory matching:

```text
$CLAUDE_DIR/plugins/cache/*/claude-hud-cache-hit/*/dist/index.js
```

On Windows, use Node.js. On macOS/Linux, use Node.js or Bun. Stop with a clear message if the runtime or `dist/index.js` cannot be found.

## 2. Preserve existing settings

Read `$CLAUDE_DIR/settings.json` with a JSON parser. If it is invalid JSON, do not overwrite it.

Before changing it, create a timestamped backup next to it. If `statusLine.command` already exists:

- If it targets `claude-hud-cache-hit`, update it without asking.
- If it targets `claude-hud-custom`, explain that this is the legacy manual cache-hit setup and offer to migrate it.
- Otherwise, show a redacted 160-character preview and ask whether to replace it. Do nothing if declined.

Preserve all settings outside `statusLine`, including an existing `refreshInterval`.

## 3. Write the status-line command

Write a command that resolves the newest installed `claude-hud-cache-hit` version rather than hardcoding one version path.

### Windows Git Bash

```bash
cols=${COLUMNS:-}; case "$cols" in ""|*[!0-9]*) cols=120;; esac; export COLUMNS=$(( cols > 4 ? cols - 4 : 1 )); plugin_dir=$(ls -1d "${CLAUDE_CONFIG_DIR:-$HOME/.claude}"/plugins/cache/*/claude-hud-cache-hit/*/ 2>/dev/null | sort -V | tail -1); exec "{NODE_PATH}" "${plugin_dir}dist/index.js"
```

### macOS/Linux Node.js

```bash
bash -c 'cols=${COLUMNS:-}; case "$cols" in ""|*[!0-9]*) cols=120;; esac; export COLUMNS=$(( cols > 4 ? cols - 4 : 1 )); plugin_dir=$(ls -d "${CLAUDE_CONFIG_DIR:-$HOME/.claude}"/plugins/cache/*/claude-hud-cache-hit/*/ 2>/dev/null | sort -V | tail -1); exec "{NODE_PATH}" "${plugin_dir}dist/index.js"'
```

### Windows PowerShell

Create `${CLAUDE_DIR}/plugins/claude-hud-cache-hit/statusline.mjs` with a Node launcher that scans `plugins/cache/*/claude-hud-cache-hit/*`, chooses the highest semver directory containing `dist/index.js`, adjusts `COLUMNS` by four, dynamically imports `dist/index.js`, and calls its exported `main()` function. Run that launcher using the absolute `node.exe` path through `cmd.exe`.

Use JSON serialization for settings writes. On Windows PowerShell, write UTF-8 without a BOM.

## 4. Migrate legacy HUD settings

The fork owns `${CLAUDE_DIR}/plugins/claude-hud-cache-hit/config.json`. If this file is missing and `${CLAUDE_DIR}/plugins/claude-hud/config.json` or `${CLAUDE_DIR}/plugins/claude-hud-custom/config.json` exists, offer to copy its JSON fields into the new file. Never delete or modify either legacy file.

Ensure the migrated/new config has these defaults unless the user explicitly chooses otherwise:

```json
{
  "display": {
    "showSessionTokens": true,
    "showCacheHitRate": true,
    "showPromptCache": false
  }
}
```

This places cumulative token totals and cache-hit rates on the Context row and hides the old `Cache ⏱ expired` countdown.

## 5. Verify

1. Confirm the generated command runs without an error using a small JSON stdin payload.
2. Confirm it resolves an installed `dist/index.js`.
3. Confirm `settings.json` still parses and `statusLine.command` points to `claude-hud-cache-hit`.
4. Tell the user to send one message or run `/reload-plugins`; Claude Code reloads status-line settings automatically on current versions.

Do not publish, install, uninstall, or enable/disable plugins as part of setup. The user controls those operations with `/plugin`.
