import type { RenderContext } from '../../types.js';
export declare function formatSessionTokenSummary(tokens: NonNullable<RenderContext['transcript']['sessionTokens']>, prefix: string): string | null;
export declare function formatCacheHitRates(currentUsage: NonNullable<NonNullable<RenderContext['stdin']['context_window']>['current_usage']> | null | undefined, sessionTokens: RenderContext['transcript']['sessionTokens'], statusFile: RenderContext['statusFile']): string | null;
export declare function renderSessionTokensLine(ctx: RenderContext): string | null;
//# sourceMappingURL=session-tokens.d.ts.map