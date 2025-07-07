import type { EasingState } from '~/state/easing-store';
import type { EasingStateShare} from '~/types-and-enums';
import { EasingType } from '~/types-and-enums';
import { createCubicBezierString, cssStringToTailwind, generateLinearEasing } from '~/utils/easing';
import {
  generateBezierSVGPath,
  generateBounceSVGPolyline,
  generateOvershootSVGPolyline,
  generateSpringSVGPolyline,
  generateWiggleSVGPolyline,
} from '~/utils/svg';
import { BezierInputSchema, BounceInputSchema, OvershootInputSchema, SpringInputSchema, WiggleInputSchema } from '~/validations/easing';

export function getApiResponseFromState(state: EasingState) {
  switch (state.easingType) {
    case EasingType.BEZIER: {
      return {
        input: {
          x1: state.bezierX1,
          y1: state.bezierY1,
          x2: state.bezierX2,
          y2: state.bezierY2,
        },
        output: {
          css: state.bezierValue,
          tailwind_css: cssStringToTailwind(state.bezierValue),
          svg_path: generateBezierSVGPath({
            x1: state.bezierX1,
            y1: state.bezierY1,
            x2: state.bezierX2,
            y2: state.bezierY2,
          }),
        },
      };
    }
    case EasingType.SPRING: {
      return {
        input: {
          mass: state.springMass,
          stiffness: state.springStiffness,
          damping: state.springDamping,
          accuracy: state.editorAccuracy,
        },
        output: {
          css: state.springValue,
          tailwind_css: cssStringToTailwind(state.springValue),
          svg_polyline: generateSpringSVGPolyline(state.springPoints),
        },
      };
    }
    case EasingType.BOUNCE: {
      return {
        input: {
          bounces: state.bounceBounces,
          damping: state.bounceDamping,
          accuracy: state.editorAccuracy,
        },
        output: {
          css: state.bounceValue,
          tailwind_css: cssStringToTailwind(state.bounceValue),
          svg_polyline: generateBounceSVGPolyline(state.bouncePoints),
        },
      };
    }
    case EasingType.WIGGLE: {
      return {
        input: {
          wiggles: state.wiggleWiggles,
          damping: state.wiggleDamping,
          accuracy: state.editorAccuracy,
        },
        output: {
          css: state.wiggleValue,
          tailwind_css: cssStringToTailwind(state.wiggleValue),
          svg_polyline: generateWiggleSVGPolyline(state.wigglePoints),
        },
      };
    }
    case EasingType.OVERSHOOT: {
      return {
        input: {
          style: state.overshootStyle,
          mass: state.overshootMass,
          damping: state.overshootDamping,
          accuracy: state.editorAccuracy,
        },
        output: {
          css: state.overshootValue,
          tailwind_css: cssStringToTailwind(state.overshootValue),
          svg_polyline: generateOvershootSVGPolyline(state.overshootPoints),
        },
      };
    }
  }
}

export function getApiResponseFromInput(type: EasingType, config: unknown) {
  switch (type) {
    case EasingType.BEZIER: {
      const bezierConfig = BezierInputSchema.parse(config);
      const bezierString = createCubicBezierString(bezierConfig);
      const shareState: EasingStateShare = {
        easingType: EasingType.BEZIER,
        bezierX1: bezierConfig.x1,
        bezierY1: bezierConfig.y1,
        bezierX2: bezierConfig.x2,
        bezierY2: bezierConfig.y2,
      };

      return {
        input: bezierConfig,
        output: {
          css: bezierString,
          tailwind_css: cssStringToTailwind(bezierString),
          svg_path: generateBezierSVGPath(bezierConfig),
        },
        shareState,
      };
    }
    case EasingType.SPRING: {
      const springConfig = SpringInputSchema.parse(config);
      const { easingValue, sampledPoints } = generateLinearEasing({ type, ...springConfig });
      const shareState: EasingStateShare = {
        easingType: EasingType.SPRING,
        springMass: springConfig.mass,
        springStiffness: springConfig.stiffness,
        springDamping: springConfig.damping,
        editorAccuracy: springConfig.accuracy,
      };

      return {
        input: springConfig,
        output: {
          css: easingValue,
          tailwind_css: cssStringToTailwind(easingValue),
          svg_polyline: generateSpringSVGPolyline(sampledPoints),
        },
        shareState,
      };
    }
    case EasingType.BOUNCE: {
      const bounceConfig = BounceInputSchema.parse(config);
      const { easingValue, sampledPoints } = generateLinearEasing({ type, ...bounceConfig });
      const shareState: EasingStateShare = {
        easingType: EasingType.BOUNCE,
        bounceBounces: bounceConfig.bounces,
        bounceDamping: bounceConfig.damping,
        editorAccuracy: bounceConfig.accuracy,
      };

      return {
        input: bounceConfig,
        output: {
          css: easingValue,
          tailwind_css: cssStringToTailwind(easingValue),
          svg_polyline: generateBounceSVGPolyline(sampledPoints),
        },
        shareState,
      };
    }
    case EasingType.WIGGLE: {
      const wiggleConfig = WiggleInputSchema.parse(config);
      const { easingValue, sampledPoints } = generateLinearEasing({ type, ...wiggleConfig });
      const shareState: EasingStateShare = {
        easingType: EasingType.WIGGLE,
        wiggleWiggles: wiggleConfig.wiggles,
        wiggleDamping: wiggleConfig.damping,
        editorAccuracy: wiggleConfig.accuracy,
      };

      return {
        input: wiggleConfig,
        output: {
          css: easingValue,
          tailwind_css: cssStringToTailwind(easingValue),
          svg_polyline: generateWiggleSVGPolyline(sampledPoints),
        },
        shareState,
      };
    }
    case EasingType.OVERSHOOT: {
      const overshootConfig = OvershootInputSchema.parse(config);
      const { easingValue, sampledPoints } = generateLinearEasing({ type, ...overshootConfig });
      const shareState: EasingStateShare = {
        easingType: EasingType.OVERSHOOT,
        overshootStyle: overshootConfig.style,
        overshootMass: overshootConfig.mass,
        overshootDamping: overshootConfig.damping,
        editorAccuracy: overshootConfig.accuracy,
      };

      return {
        input: overshootConfig,
        output: {
          css: easingValue,
          tailwind_css: cssStringToTailwind(easingValue),
          svg_polyline: generateOvershootSVGPolyline(sampledPoints),
        },
        shareState,
      };
    }
    default:
      throw new Error('Invalid easing type');
  }
}
