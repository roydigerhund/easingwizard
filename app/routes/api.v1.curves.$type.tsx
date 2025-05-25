import { ActionFunctionArgs } from '@vercel/remix';
import z from 'zod/v4';
import { apiOrigin, productionOrigin } from '~/data/globals';
import { EasingType } from '~/types-and-enums';
import { createCubicBezierString, cssStringToTailwind, generateLinearEasing } from '~/utils/easing';
import {
  generateBezierSVGPath,
  generateBounceSVGPolyline,
  generateOvershootSVGPolyline,
  generateSpringSVGPolyline,
  generateWiggleSVGPolyline,
} from '~/utils/svg';
import {
  BezierInput,
  BounceInput,
  EasingTypeInput,
  OvershootInput,
  SpringInput,
  WiggleInput,
} from '~/validations/easing';

function getOutput(type: EasingType, config: unknown) {
  switch (type) {
    case EasingType.BEZIER: {
      const bezierConfig = BezierInput.parse(config);
      const bezierString = createCubicBezierString(bezierConfig);

      return {
        input: bezierConfig,
        output: {
          css: bezierString,
          tailwind_css: cssStringToTailwind(bezierString),
          svg_path: generateBezierSVGPath(bezierConfig),
        },
      };
    }
    case EasingType.SPRING: {
      const springConfig = SpringInput.parse(config);
      const { easingValue, sampledPoints } = generateLinearEasing({ type, ...springConfig });
      return {
        input: springConfig,
        output: {
          css: easingValue,
          tailwind_css: cssStringToTailwind(easingValue),
          svg_polyline: generateSpringSVGPolyline(sampledPoints),
        },
      };
    }
    case EasingType.BOUNCE: {
      const bounceConfig = BounceInput.parse(config);
      const { easingValue, sampledPoints } = generateLinearEasing({ type, ...bounceConfig });
      return {
        input: bounceConfig,
        output: {
          css: easingValue,
          tailwind_css: cssStringToTailwind(easingValue),
          svg_polyline: generateBounceSVGPolyline(sampledPoints),
        },
      };
    }
    case EasingType.WIGGLE: {
      const wiggleConfig = WiggleInput.parse(config);
      const { easingValue, sampledPoints } = generateLinearEasing({ type, ...wiggleConfig });
      return {
        input: wiggleConfig,
        output: {
          css: easingValue,
          tailwind_css: cssStringToTailwind(easingValue),
          svg_polyline: generateWiggleSVGPolyline(sampledPoints),
        },
      };
    }
    case EasingType.OVERSHOOT: {
      const overshootConfig = OvershootInput.parse(config);
      const { easingValue, sampledPoints } = generateLinearEasing({ type, ...overshootConfig });
      return {
        input: overshootConfig,
        output: {
          css: easingValue,
          tailwind_css: cssStringToTailwind(easingValue),
          svg_polyline: generateOvershootSVGPolyline(sampledPoints),
        },
      };
    }
    default:
      throw new Error('Invalid easing type');
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const config = await request.json();

  try {
    const type = EasingTypeInput.parse(params.type);

    const { input, output } = getOutput(type, config);

    return {
      // metadata
      id: 'placeholder',
      type,
      generated_at: new Date().toISOString(),
      input,
      output,
      // HATEOAS
      links: {
        self: `${apiOrigin}/curves/${type}`,
        preview_svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M0,100 C${config.x1 * 100},${100 - config.y1 * 100} ${config.x2 * 100},${100 - config.y2 * 100} 100,0" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
        share_url: `${productionOrigin}/${type}`,
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ errors: error.issues }), { status: 400 });
    }
    return new Response(
      typeof error === 'object' && error && 'message' in error && typeof error.message === 'string'
        ? error.message
        : 'Invalid parameters',
      { status: 400 },
    );
  }
}
