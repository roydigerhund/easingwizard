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
  svg_path: z.string().optional().meta({
    description: 'SVG path for Bézier curves',
    example: 'M0,100 C66,100 34,0 100,0',
  }),
}).meta({
  id: 'BezierEasingOutput',
  title: 'Bézier Easing Output',
  description: 'CSS and SVG output for Bézier easing functions',
});

export const LinearEasingOutputSchema = BaseOutputSchema.extend({
  svg_polyline: z.string().optional().meta({
    description: 'SVG polyline for linear easing curves',
    example: '0,75 15.2,39.6 32.8,21.75 50,18.45 100,25',
  }),
}).meta({
  id: 'LinearEasingOutput',
  title: 'Linear Easing Output',
  description: 'CSS and SVG output for linear easing functions',
});

export const OutputUnionSchema = z.union([BezierEasingOutputSchema, LinearEasingOutputSchema]).meta({
  description: 'CSS and SVG output for easing functions',
});

export type BezierEasingOutput = z.infer<typeof BezierEasingOutputSchema>;
export type LinearEasingOutput = z.infer<typeof LinearEasingOutputSchema>;
export type OutputUnion = z.infer<typeof OutputUnionSchema>;
