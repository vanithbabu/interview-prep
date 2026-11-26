export interface CodeRunResult {
  ok: boolean;
  output: string;
  error?: string;
}

const MAX_CODE_LENGTH = 4000;
const MAX_OUTPUT_LINES = 50;

function formatValue(val: unknown): string {
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean' || val === null || val === undefined) {
    return String(val);
  }
  try {
    return JSON.stringify(val);
  } catch {
    return String(val);
  }
}

/**
 * Runs simple synchronous JavaScript learning snippets in a restricted scope
 * with shadowed globals and bounded output.
 */
export function runSandboxedJavaScript(code: string): CodeRunResult {
  if (code.length > MAX_CODE_LENGTH) {
    return {
      ok: false,
      output: '',
      error: `Code exceeds maximum length of ${MAX_CODE_LENGTH} characters.`,
    };
  }

  const logs: string[] = [];
  const fakeConsole = {
    log: (...args: unknown[]) => {
      if (logs.length < MAX_OUTPUT_LINES) {
        logs.push(args.map(formatValue).join(' '));
      }
    },
    warn: (...args: unknown[]) => {
      if (logs.length < MAX_OUTPUT_LINES) {
        logs.push(`[warn] ${args.map(formatValue).join(' ')}`);
      }
    },
    error: (...args: unknown[]) => {
      if (logs.length < MAX_OUTPUT_LINES) {
        logs.push(`[error] ${args.map(formatValue).join(' ')}`);
      }
    },
  };

  try {
    // Shadow sensitive globals so snippets cannot access fetch, storage, or globalThis.
    const fn = new Function(
      'console',
      'fetch',
      'XMLHttpRequest',
      'WebSocket',
      'globalThis',
      'window',
      'process',
      'require',
      `"use strict";\n${code}`
    );
    fn(fakeConsole, undefined, undefined, undefined, undefined, undefined, undefined, undefined);

    return {
      ok: true,
      output: logs.length > 0 ? logs.join('\n') : '(No console output)',
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Execution error';
    return {
      ok: false,
      output: logs.join('\n'),
      error: message,
    };
  }
}
