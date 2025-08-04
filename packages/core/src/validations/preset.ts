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
import { CurveIdSchema } from './curve';
import { presetsLinksResponseSchema } from './hateoas';
import {
  BezierParamsSchema,
  BounceParamsSchema,
  OvershootParamsSchema,
  SpringParamsSchema,
  WiggleParamsSchema,
} from './input';
import { BezierEasingOutputSchema, LinearEasingOutputSchema } from './output';

// Bézier preset schema
export const BezierPresetSchema = z
  .object({
    id: CurveIdSchema,
    type: z.literal(EasingType.BEZIER).meta({
      description: 'Bézier easing type',
    }),
    style: z.enum(BezierStyle).meta({
      description: 'Bézier easing style',
      example: BezierStyle.IN_OUT,
    }),
    curve: z.enum(BezierCurve).meta({
      description: 'Bézier curve variant',
      example: BezierCurve.CUBIC,
    }),
    params: BezierParamsSchema,
    output: BezierEasingOutputSchema,
  })
  .meta({
    id: 'BezierPreset',
    title: 'Bézier Type Preset',
    description: 'Bézier easing preset configuration',
  });

// Spring preset schema
export const SpringPresetSchema = z
  .object({
    id: CurveIdSchema,
    type: z.literal(EasingType.SPRING).meta({
      description: 'Spring easing type',
    }),
    curve: z.enum(SpringCurve).meta({
      description: 'Spring curve variant',
      example: SpringCurve.HEAVY,
    }),
    params: SpringParamsSchema,
    output: LinearEasingOutputSchema,
  })
  .meta({
    id: 'SpringPreset',
    title: 'Spring Type Preset',
    description: 'Spring easing preset configuration',
  });

// Bounce preset schema
export const BouncePresetSchema = z
  .object({
    id: CurveIdSchema,
    type: z.literal(EasingType.BOUNCE).meta({
      description: 'Bounce easing type',
    }),
    curve: z.enum(BounceCurve).meta({
      description: 'Bounce curve variant',
      example: BounceCurve.FIRM,
    }),
    params: BounceParamsSchema,
    output: LinearEasingOutputSchema,
  })
  .meta({
    id: 'BouncePreset',
    title: 'Bounce Type Preset',
    description: 'Bounce easing preset configuration',
  });

// Wiggle preset schema
export const WigglePresetSchema = z
  .object({
    id: CurveIdSchema,
    type: z.literal(EasingType.WIGGLE).meta({
      description: 'Wiggle easing type',
    }),
    curve: z.enum(WiggleCurve).meta({
      description: 'Wiggle curve variant',
      example: WiggleCurve.SUBTLE,
    }),
    params: WiggleParamsSchema,
    output: LinearEasingOutputSchema,
  })
  .meta({
    id: 'WigglePreset',
    title: 'Wiggle Type Preset',
    description: 'Wiggle easing preset configuration',
  });

// Overshoot preset schema
export const OvershootPresetSchema = z
  .object({
    id: CurveIdSchema,
    type: z.literal(EasingType.OVERSHOOT).meta({
      description: 'Overshoot easing type',
    }),
    style: z.enum(OvershootStyle).meta({
      description: 'Overshoot easing style',
      example: OvershootStyle.IN,
    }),
    curve: z.enum(OvershootCurve).meta({
      description: 'Overshoot curve variant',
      example: OvershootCurve.SOFT,
    }),
    params: OvershootParamsSchema,
    output: LinearEasingOutputSchema,
  })
  .meta({
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
