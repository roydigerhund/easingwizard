// routes/_openapi.ts    ← purely declarative
import { z } from 'zod/v4';
import {
  BezierInput,
  BounceInput,
  EasingTypeInput,
  OvershootInput,
  SpringInput,
  WiggleInput,
} from '~/validations/easing';

export const curvesPost = {
  method: 'post',
  path: '/api/v1/curves/{type}',
  summary: 'Generate curve code & preview assets',
  pathParams: z.object({
    type: z.toJSONSchema(EasingTypeInput),
  }),
  request: {
    body: z.discriminatedUnion('type', [
      BezierInput.extend({ type: z.literal('bezier') }),
      SpringInput.extend({ type: z.literal('spring') }),
      BounceInput.extend({ type: z.literal('bounce') }),
      WiggleInput.extend({ type: z.literal('wiggle') }),
      OvershootInput.extend({ type: z.literal('overshoot') }),
    ]),
  },
  responses: {
    200: {
      description: 'Generated code & SVG/polyline',
      content: {
        'application/json': z.object({
          id: z.string(),
          type: z.string(),
          generated_at: z.string().datetime(),
          input: z.any(),
          output: z.any(),
          links: z.any(),
        }),
      },
    },
    400: { description: 'Validation error' },
  },
};
