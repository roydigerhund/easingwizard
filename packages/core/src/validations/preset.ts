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
import { presetsLinksResponseSchema } from './hateoas';
import {
  BezierInputSchema,
  BounceInputSchema,
  EasingTypeSchema,
  OvershootInputSchema,
  SpringInputSchema,
  WiggleInputSchema,
} from './input';
import { BezierEasingOutputSchema, LinearEasingOutputSchema } from './output';

// Base preset schema with common fields
const BasePresetSchema = z.object({
  id: z.string().meta({
    description: 'Unique preset identifier',
    example: 'abc123def',
  }),
  type: EasingTypeSchema,
});

// Bézier preset schema
export const BezierPresetSchema = BasePresetSchema.extend({
  type: z.literal(EasingType.BEZIER).meta({
    description: 'Bézier easing type',
  }),
  style: z.enum(BezierStyle).meta({
    description: 'Bézier easing style',
    example: 'inOut',
  }),
  curve: z.enum(BezierCurve).meta({
    description: 'Bézier curve variant',
    example: 'cubic',
  }),
  params: BezierInputSchema,
  output: BezierEasingOutputSchema,
}).meta({
  id: 'BezierPreset',
  title: 'Bézier Type Preset',
  description: 'Bézier easing preset configuration',
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
  output: LinearEasingOutputSchema,
}).meta({
  id: 'SpringPreset',
  title: 'Spring Type Preset',
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
  output: LinearEasingOutputSchema,
}).meta({
  id: 'BouncePreset',
  title: 'Bounce Type Preset',
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
  output: LinearEasingOutputSchema,
}).meta({
  id: 'WigglePreset',
  title: 'Wiggle Type Preset',
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
  output: LinearEasingOutputSchema,
}).meta({
  id: 'OvershootPreset',
  title: 'Overshoot Type Preset',
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
  description: 'Array of Bézier easing presets',
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

export const AllPresetArraySchema = z.array(PresetSchema).meta({
  description: 'Array of all easing presets',
});

export const PresetsResponseSchema = z
  .object({
    version: z.string().meta({
      description: 'Version hash of the presets data',
      example: 'a1b2c3d4',
    }),
    presets: AllPresetArraySchema,
    links: presetsLinksResponseSchema,
  })
  .meta({
    id: 'PresetsResponse',
    description: 'Collection of preset easing curves',
  });

  
  // Type exports
  export type BezierPreset = z.infer<typeof BezierPresetSchema>;
  export type SpringPreset = z.infer<typeof SpringPresetSchema>;
  export type BouncePreset = z.infer<typeof BouncePresetSchema>;
  export type WigglePreset = z.infer<typeof WigglePresetSchema>;
  export type OvershootPreset = z.infer<typeof OvershootPresetSchema>;
  export type Preset = z.infer<typeof PresetSchema>;
  export type PresetsResponse = z.infer<typeof PresetsResponseSchema>;
