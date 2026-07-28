# Claude HUD Cache Hit

这是一个基于 [claude-hud](https://github.com/jarrodwatts/claude-hud) 的独立 Claude Code 状态栏插件，增加了缓存命中率显示。

## 特性

- Context 行显示累计 Token：输入、输出、缓存。
- 显示本次请求和整个会话的缓存命中率。
- 优先使用 Claude Code 提供的 `CLAUDE_STATUS_FILE.cacheHitPercent`，缺失时从 transcript 统计回退计算。
- 默认关闭原始 `Cache ⏱ expired` 倒计时。
- 配置目录独立于官方 Claude HUD，可同时安装。

示例：

```text
Context █████░░░░░ 45% Tokens 20.3M (in: 14.6M, out: 14k, cache: 5.7M) 本次命中70.00%·平均76.50%
```

## 发布后的安装方式


```text
/plugin marketplace add https://github.com/bearchild233/claude-hud-cache-hit
/plugin install claude-hud-cache-hit@claude-hud-cache-hit
/reload-plugins
/claude-hud-cache-hit:setup
```

## 配置

配置文件位置：

```text
~/.claude/plugins/claude-hud-cache-hit/config.json
```

推荐配置：

```json
{
  "display": {
    "showSessionTokens": true,
    "showCacheHitRate": true,
    "showPromptCache": false
  }
}
```

- `showSessionTokens`：在 Context 行显示会话累计 Token。
- `showCacheHitRate`：在同一行显示本次和平均命中率。
- `showPromptCache`：控制旧版 `Cache ⏱ expired` 倒计时；本 fork 默认关闭。

缓存命中率公式：

```text
cache_read / (input + cache_creation + cache_read) * 100
```

## 从旧配置迁移

`/claude-hud-cache-hit:setup` 可以识别官方 `claude-hud` 和旧的手工 `claude-hud-custom` 状态栏。它会在替换 statusLine 前备份 settings，并可将旧显示配置迁移到新目录，不会删除或修改官方插件的配置。

Claude Code 一次只能启用一个 `statusLine.command`，但官方插件和本 fork 可以同时安装。

## 开发

```bash
npm ci
npm run build
npm test
```

`dist/` 会被提交，因为 Claude Code 安装 marketplace 插件后不会替用户运行构建。

发布前请替换 manifest 和 package 中的发布者/仓库占位符。

## 归属

本项目是 [jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud) 的独立 MIT fork。详见 [UPSTREAM.md](UPSTREAM.md) 与 [LICENSE](LICENSE)。
