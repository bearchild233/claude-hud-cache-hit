import type { RenderContext } from '../../types.js';
import { label } from '../colors.js';
import { t } from '../../i18n/index.js';
import { formatTokens } from '../../utils/format.js';

/**
 * Cache hit rate = what fraction of all input tokens were served from cache.
 *   cache_read / (input + cache_creation + cache_read)
 * This avoids the 100%-all-the-time problem of cache_read/(cache_read+cache_creation).
 */
function calcHitRate(
  inputTokens: number,
  creationTokens: number,
  readTokens: number,
): number | null {
  const denom = inputTokens + creationTokens + readTokens;
  if (denom === 0) return null;
  return (readTokens / denom) * 100;
}

function formatHitRate(rate: number | null): string | null {
  if (rate === null) return null;
  return `${rate.toFixed(2)}%`;
}

export function formatSessionTokenSummary(
  tokens: NonNullable<RenderContext['transcript']['sessionTokens']>,
  prefix: string,
): string | null {
  const total = tokens.inputTokens + tokens.outputTokens + tokens.cacheCreationTokens + tokens.cacheReadTokens;
  if (total === 0) {
    return null;
  }

  const parts: string[] = [
    `${t('format.in')}: ${formatTokens(tokens.inputTokens)}`,
    `${t('format.out')}: ${formatTokens(tokens.outputTokens)}`,
  ];

  if (tokens.cacheCreationTokens > 0 || tokens.cacheReadTokens > 0) {
    parts.push(`${t('format.cache')}: ${formatTokens(tokens.cacheCreationTokens + tokens.cacheReadTokens)}`);
  }

  return `${prefix} ${formatTokens(total)} (${parts.join(', ')})`;
}

export function formatCacheHitRates(
  currentUsage: NonNullable<NonNullable<RenderContext['stdin']['context_window']>['current_usage']> | null | undefined,
  sessionTokens: RenderContext['transcript']['sessionTokens'],
  statusFile: RenderContext['statusFile'],
): string | null {
  // Current request: fraction of this request's input that was cache reads
  const currentHit = calcHitRate(
    currentUsage?.input_tokens ?? 0,
    currentUsage?.cache_creation_input_tokens ?? 0,
    currentUsage?.cache_read_input_tokens ?? 0,
  );

  // Session average: prefer Claude Code's pre-computed value from CLAUDE_STATUS_FILE,
  // fall back to manual calculation from transcript session totals.
  let avgHit: number | null;
  if (typeof statusFile?.cacheHitPercent === 'number' && Number.isFinite(statusFile.cacheHitPercent)) {
    avgHit = statusFile.cacheHitPercent;
  } else {
    avgHit = calcHitRate(
      sessionTokens?.inputTokens ?? 0,
      sessionTokens?.cacheCreationTokens ?? 0,
      sessionTokens?.cacheReadTokens ?? 0,
    );
  }

  if (currentHit === null && avgHit === null) return null;

  const currentStr = formatHitRate(currentHit);
  const avgStr = formatHitRate(avgHit);

  const parts: string[] = [];
  if (currentStr !== null) {
    parts.push(`${t('format.cacheHitCurrent')}${currentStr}`);
  }
  if (avgStr !== null) {
    parts.push(`${t('format.cacheHitAvg')}${avgStr}`);
  }

  return parts.join('·');
}

export function renderSessionTokensLine(ctx: RenderContext): string | null {
  const display = ctx.config?.display;
  if (display?.showSessionTokens === false) return null;

  const tokens = ctx.transcript.sessionTokens;
  if (!tokens) return null;

  const summary = formatSessionTokenSummary(tokens, t('label.tokens'));
  return summary ? label(summary, ctx.config?.colors) : null;
}
