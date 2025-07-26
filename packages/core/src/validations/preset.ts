import { z } from 'zod/v4';
import {
  BezierCurve,
  BezierStyle,
  BounceCurve,
  EasingType,
  OvershootCurve,
  OvershootStyle,
  SpringCurve,
  WiggleCurve,
} from '~/types/enums';
import {
  BezierInputSchema,
  BounceInputSchema,
  EasingTypeSchema,
  OvershootInputSchema,
  SpringInputSchema,
  WiggleInputSchema,
} from './input';

const BaseOutputSchema = z
  .object({
    css: z.string().meta({
      description: 'CSS easing function string',
      example: 'cubic-bezier(0.66, 0, 0.34, 1)',
    }),
    tailwind_css: z.string().meta({
      description: 'Tailwind CSS compatible easing string',
      example: 'ease-[cubic-bezier(0.66,0,0.34,1)]',
    }),
  })
  .meta({
    description: 'Generated easing function output',
  });

const BezierOutputSchema = BaseOutputSchema.extend({
  svg_path: z.string().optional().meta({
    description: 'SVG path for bezier curves',
    example: 'M0,100 C66,100 34,0 100,0',
  }),
});

const LinearOutputSchema = BaseOutputSchema.extend({
  svg_polyline: z.string().optional().meta({
    description: 'SVG polyline for linear easing curves',
    example: '0,75 15.2,39.6 32.8,21.75 50,18.45 100,25',
  }),
});

// Base preset schema with common fields
const BasePresetSchema = z.object({
  id: z.string().meta({
    description: 'Unique preset identifier',
    example: 'abc123def',
  }),
  type: EasingTypeSchema,
});

// Bezier preset schema
export const BezierPresetSchema = BasePresetSchema.extend({
  type: z.literal(EasingType.BEZIER).meta({
    description: 'Bezier easing type',
  }),
  style: z.enum(BezierStyle).meta({
    description: 'Bezier easing style',
    example: 'inOut',
  }),
  curve: z.enum(BezierCurve).meta({
    description: 'Bezier curve variant',
    example: 'cubic',
  }),
  params: BezierInputSchema,
  output: BezierOutputSchema,
}).meta({
  id: 'BezierPreset',
  description: 'Bezier easing preset configuration',
});

// Spring preset schema
export const SpringPresetSchema = BasePresetSchema.extend({
  type: z.literal(EasingType.SPRING).meta({
    description: 'Spring easing type',
  }),
  curve: z.enum(SpringCurve).meta({
    description: 'Spring curve variant',
    example: 'heavy',
  }),
  params: SpringInputSchema,
  output: LinearOutputSchema,
}).meta({
  id: 'SpringPreset',
  description: 'Spring easing preset configuration',
});

// Bounce preset schema
export const BouncePresetSchema = BasePresetSchema.extend({
  type: z.literal(EasingType.BOUNCE).meta({
    description: 'Bounce easing type',
  }),
  curve: z.enum(BounceCurve).meta({
    description: 'Bounce curve variant',
    example: 'firm',
  }),
  params: BounceInputSchema,
  output: LinearOutputSchema,
}).meta({
  id: 'BouncePreset',
  description: 'Bounce easing preset configuration',
});

// Wiggle preset schema
export const WigglePresetSchema = BasePresetSchema.extend({
  type: z.literal(EasingType.WIGGLE).meta({
    description: 'Wiggle easing type',
  }),
  curve: z.enum(WiggleCurve).meta({
    description: 'Wiggle curve variant',
    example: 'subtle',
  }),
  params: WiggleInputSchema,
  output: LinearOutputSchema,
}).meta({
  id: 'WigglePreset',
  description: 'Wiggle easing preset configuration',
});

// Overshoot preset schema
export const OvershootPresetSchema = BasePresetSchema.extend({
  type: z.literal(EasingType.OVERSHOOT).meta({
    description: 'Overshoot easing type',
  }),
  style: z.enum(OvershootStyle).meta({
    description: 'Overshoot easing style',
    example: 'in',
  }),
  curve: z.enum(OvershootCurve).meta({
    description: 'Overshoot curve variant',
    example: 'soft',
  }),
  params: OvershootInputSchema,
  output: LinearOutputSchema,
}).meta({
  id: 'OvershootPreset',
  description: 'Overshoot easing preset configuration',
});

// Union of all preset types
export const PresetSchema = z
  .union([BezierPresetSchema, SpringPresetSchema, BouncePresetSchema, WigglePresetSchema, OvershootPresetSchema])
  .meta({
    id: 'Preset',
    description: 'Easing preset configuration',
  });

// Preset category unions
export const BezierPresetArraySchema = z.array(BezierPresetSchema).meta({
  description: 'Array of bezier easing presets',
});

export const SpringPresetArraySchema = z.array(SpringPresetSchema).meta({
  description: 'Array of spring easing presets',
});

export const BouncePresetArraySchema = z.array(BouncePresetSchema).meta({
  description: 'Array of bounce easing presets',
});

export const WigglePresetArraySchema = z.array(WigglePresetSchema).meta({
  description: 'Array of wiggle easing presets',
});

export const OvershootPresetArraySchema = z.array(OvershootPresetSchema).meta({
  description: 'Array of overshoot easing presets',
});

// Complete preset data schema
export const PresetDataSchema = z
  .object({
    bezier: BezierPresetArraySchema,
    spring: SpringPresetArraySchema,
    bounce: BouncePresetArraySchema,
    wiggle: WigglePresetArraySchema,
    overshoot: OvershootPresetArraySchema,
  })
  .meta({
    id: 'PresetData',
    description: 'Complete preset data object containing all easing categories',
  });

// Type exports
export type BezierPreset = z.infer<typeof BezierPresetSchema>;
export type SpringPreset = z.infer<typeof SpringPresetSchema>;
export type BouncePreset = z.infer<typeof BouncePresetSchema>;
export type WigglePreset = z.infer<typeof WigglePresetSchema>;
export type OvershootPreset = z.infer<typeof OvershootPresetSchema>;
export type Preset = z.infer<typeof PresetSchema>;
export type PresetData = z.infer<typeof PresetDataSchema>;
