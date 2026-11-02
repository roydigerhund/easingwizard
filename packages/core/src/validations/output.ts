import z from 'zod/v4';

export const BaseOutputSchema = z.object({
  css: z.string().meta({
    description: 'CSS easing function string',
  }),
  tailwind_css: z.string().meta({
    description: 'Tailwind CSS compatible easing function string',
  }),
});

export const BezierEasingOutputSchema = BaseOutputSchema.extend({
  css: BaseOutputSchema.shape.css.meta({
    description: 'CSS easing function string',
    example: 'cubic-bezier(0.25, 0.1, 0.75, 0.9)',
  }),
  tailwind_css: BaseOutputSchema.shape.tailwind_css.meta({
    description: 'Tailwind CSS compatible easing function string',
    example: 'ease-[cubic-bezier(0.25,0.1,0.75,0.9)]',
  }),
  svg_path: z.string().meta({
    description: 'SVG path for Bézier curves',
    example: 'M0,100 C25,90 75,10 100,0',
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
