import z from 'zod/v4';

export const healthCheckSchema = z.object({
  status: z.enum(['ok', 'degraded', 'error']).describe('Health status of the API'),
  timestamp: z.string().describe('Current timestamp'),
});

export type HealthCheckResponse = z.infer<typeof healthCheckSchema>;