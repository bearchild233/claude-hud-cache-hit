# Upstream Attribution

Claude HUD Cache Hit is an independent fork of [jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud).

The fork retains the upstream MIT license in [LICENSE](LICENSE). It adds cache-hit metrics, moves token totals and metrics to the Context row, defaults the prompt-cache countdown off, and uses an independent plugin identity and state directory.

## Sync Policy

When adopting a future upstream release:

1. Compare source changes against the current fork.
2. Preserve the fork identity, manifests, setup/configure paths, and cache-hit behavior.
3. Rebuild and commit the complete `dist/` tree.
4. Run the test suite and validate marketplace installation from a clean Claude configuration directory.
5. Record the upstream base version and fork-specific changes in the changelog.
