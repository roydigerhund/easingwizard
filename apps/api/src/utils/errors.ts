import type { ZodError } from 'zod/v4';

export const transformZodError = (error: ZodError) =>
  error.issues.map((issue) => ({
    code: issue.code,
    message: issue.message,
    path: issue.path.filter((p): p is string | number => typeof p === 'string' || typeof p === 'number'),
    ...('values' in issue && Array.isArray(issue.values) ? { values: issue.values.map(String) } : {}),
    ...('expected' in issue && issue.expected ? { expected: String(issue.expected) } : {}),
    ...('options' in issue && Array.isArray(issue.options) ? { values: issue.options.map(String) } : {}),
  }));

export const transformOtherError = (error: unknown) => [
  {
    code: 'invalid_parameters',
    path: typeof error === 'object' && error && 'path' in error && Array.isArray(error.path) ? error.path : [],
    message:
      typeof error === 'object' && error && 'message' in error && typeof error.message === 'string'
        ? error.message
        : 'Invalid parameters',
  },
];
