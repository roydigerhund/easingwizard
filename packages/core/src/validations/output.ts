import z from 'zod/v4';

export const BaseOutputSchema = z.object({
  css: z.string().meta({
    description: 'CSS easing function string',
    example: 'cubic-bezier(0.66, 0, 0.34, 1)',
  }),
  tailwind_css: z.string().meta({
    description: 'Tailwind CSS compatible easing function string',
    example: 'ease-[cubic-bezier(0.66,0,0.34,1)]',
  }),
});

export const BezierEasingOutputSchema = BaseOutputSchema.extend({
  svg_path: z.string().meta({
    description: 'SVG path for Bézier curves',
    example: 'M0,100 C66,100 34,0 100,0',
  }),
}).meta({
  title: 'Bézier Easing Output',
  description: 'CSS and SVG output for Bézier easing functions',
});

export const SuggestedDurationSchema = z
  .object({
    min: z.number().int().positive().meta({
      description: 'Minimum suggested CSS animation/transition duration in milliseconds',
      example: 300,
    }),
    max: z.number().int().positive().meta({
      description: 'Maximum suggested CSS animation/transition duration in milliseconds',
      example: 600,
    }),
  })
  .refine((d) => d.min <= d.max, {
    message: 'min must be less than or equal to max',
  })
  .meta({
    description:
      'Suggested duration range derived from the curve physics. Shorter durations feel snappier, longer durations let complex motions (bounces, oscillations) breathe.',
  });

export const LinearEasingOutputSchema = BaseOutputSchema.extend({
  svg_polyline: z.string().meta({
    description: 'SVG polyline for linear easing curves',
    example: '0,75 15.2,39.6 32.8,21.75 50,18.45 100,25',
  }),
  suggested_duration_ms: SuggestedDurationSchema,
}).meta({
  title: 'Linear Easing Output',
  description: 'CSS and SVG output for linear easing functions',
});

export const OutputUnionSchema = z.union([BezierEasingOutputSchema, LinearEasingOutputSchema]).meta({
  description: 'CSS and SVG output for easing functions',
});

export type BezierEasingOutput = z.infer<typeof BezierEasingOutputSchema>;
export type LinearEasingOutput = z.infer<typeof LinearEasingOutputSchema>;
export type OutputUnion = z.infer<typeof OutputUnionSchema>;
