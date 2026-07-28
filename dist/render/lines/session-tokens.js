import { label } from '../colors.js';
import { t } from '../../i18n/index.js';
import { formatTokens } from '../../utils/format.js';
/**
 * Cache hit rate = what fraction of all input tokens were served from cache.
 *   cache_read / (input + cache_creation + cache_read)
 * This avoids the 100%-all-the-time problem of cache_read/(cache_read+cache_creation).
 */
function calcHitRate(inputTokens, creationTokens, readTokens) {
    const denom = inputTokens + creationTokens + readTokens;
    if (denom === 0)
        return null;
    return (readTokens / denom) * 100;
}
function formatHitRate(rate) {
    if (rate === null)
        return null;
    return `${rate.toFixed(2)}%`;
}
export function formatSessionTokenSummary(tokens, prefix) {
    const total = tokens.inputTokens + tokens.outputTokens + tokens.cacheCreationTokens + tokens.cacheReadTokens;
    if (total === 0) {
        return null;
    }
    const parts = [
        `${t('format.in')}: ${formatTokens(tokens.inputTokens)}`,
        `${t('format.out')}: ${formatTokens(tokens.outputTokens)}`,
    ];
    if (tokens.cacheCreationTokens > 0 || tokens.cacheReadTokens > 0) {
        parts.push(`${t('format.cache')}: ${formatTokens(tokens.cacheCreationTokens + tokens.cacheReadTokens)}`);
    }
    return `${prefix} ${formatTokens(total)} (${parts.join(', ')})`;
}
export function formatCacheHitRates(currentUsage, sessionTokens, statusFile) {
    // Current request: fraction of this request's input that was cache reads
    const currentHit = calcHitRate(currentUsage?.input_tokens ?? 0, currentUsage?.cache_creation_input_tokens ?? 0, currentUsage?.cache_read_input_tokens ?? 0);
    // Session average: prefer Claude Code's pre-computed value from CLAUDE_STATUS_FILE,
    // fall back to manual calculation from transcript session totals.
    let avgHit;
    if (typeof statusFile?.cacheHitPercent === 'number' && Number.isFinite(statusFile.cacheHitPercent)) {
        avgHit = statusFile.cacheHitPercent;
    }
    else {
        avgHit = calcHitRate(sessionTokens?.inputTokens ?? 0, sessionTokens?.cacheCreationTokens ?? 0, sessionTokens?.cacheReadTokens ?? 0);
    }
    if (currentHit === null && avgHit === null)
        return null;
    const currentStr = formatHitRate(currentHit);
    const avgStr = formatHitRate(avgHit);
    const parts = [];
    if (currentStr !== null) {
        parts.push(`${t('format.cacheHitCurrent')}${currentStr}`);
    }
    if (avgStr !== null) {
        parts.push(`${t('format.cacheHitAvg')}${avgStr}`);
    }
    return parts.join('·');
}
export function renderSessionTokensLine(ctx) {
    const display = ctx.config?.display;
    if (display?.showSessionTokens === false)
        return null;
    const tokens = ctx.transcript.sessionTokens;
    if (!tokens)
        return null;
    const summary = formatSessionTokenSummary(tokens, t('label.tokens'));
    return summary ? label(summary, ctx.config?.colors) : null;
}
//# sourceMappingURL=session-tokens.js.map