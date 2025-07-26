import fs from 'fs';
import {
  bezierFunctions,
  bounceFunctions,
  overshootFunctions,
  springFunctions,
  wiggleFunctions,
} from '~/data/easing-functions';
import { toScreamingSnakeCase } from '~/index';
import { EasingType, LinearEasingAccuracy, OvershootStyleKey } from '~/types/enums';
import { EasingStateShare } from '~/types/types';
import { createCubicBezierString, cssStringToTailwind, generateLinearEasing } from '~/utils/easing';
import { encodeState } from '~/utils/state-sharing/url-code';
import {
  generateBezierSVGPath,
  generateBounceSVGPolyline,
  generateOvershootSVGPolyline,
  generateSpringSVGPolyline,
  generateWiggleSVGPolyline,
} from '~/utils/svg';

const accuracy = LinearEasingAccuracy.HIGH;
const accuracyString = '##LinearEasingAccuracy.HIGH##';

function main() {
  // Generate Bezier presets
  const bezierPresets = Object.entries(bezierFunctions).flatMap(([style, curves]) => {
    return Object.entries(curves).map(([curve, params]) => {
      if (!params) {
        throw new Error(`Missing parameters for Bezier curve: ${style} - ${curve}`);
      }
      const shareState: EasingStateShare = {
        easingType: EasingType.BEZIER,
        bezierStyle: style,
        bezierCurve: curve,
      };
      const id = encodeState(shareState);
      const bezierString = createCubicBezierString(params);

      return {
        id,
        type: '##EasingType.BEZIER##',
        style: `##BezierStyle.${style}##`,
        curve: `##BezierCurve.${curve}##`,
        params,
        output: {
          css: bezierString,
          tailwind_css: cssStringToTailwind(bezierString),
          svg_path: generateBezierSVGPath(params),
        },
      };
    });
  });

  // Generate Spring presets
  const springPresets = Object.entries(springFunctions).map(([curve, params]) => {
    const shareState: EasingStateShare = {
      easingType: EasingType.SPRING,
      springCurve: curve,
    };
    const id = encodeState(shareState);
    const { easingValue, sampledPoints } = generateLinearEasing({
      type: EasingType.SPRING,
      accuracy,
      ...params,
    });

    return {
      id,
      type: '##EasingType.SPRING##',
      curve: `##SpringCurve.${curve}##`,
      params: { ...params, accuracy: accuracyString },
      output: {
        css: easingValue,
        tailwind_css: cssStringToTailwind(easingValue),
        svg_polyline: generateSpringSVGPolyline(sampledPoints),
      },
    };
  });

  // Generate Bounce presets
  const bouncePresets = Object.entries(bounceFunctions).map(([curve, params]) => {
    const shareState: EasingStateShare = {
      easingType: EasingType.BOUNCE,
      bounceCurve: curve,
    };
    const id = encodeState(shareState);
    const { easingValue, sampledPoints } = generateLinearEasing({
      type: EasingType.BOUNCE,
      accuracy,
      ...params,
    });

    return {
      id,
      type: '##EasingType.BOUNCE##',
      curve: `##BounceCurve.${curve}##`,
      params: { ...params, accuracy: accuracyString },
      output: {
        css: easingValue,
        tailwind_css: cssStringToTailwind(easingValue),
        svg_polyline: generateBounceSVGPolyline(sampledPoints),
      },
    };
  });

  // Generate Wiggle presets
  const wigglePresets = Object.entries(wiggleFunctions).map(([curve, params]) => {
    const shareState: EasingStateShare = {
      easingType: EasingType.WIGGLE,
      wiggleCurve: curve,
    };
    const id = encodeState(shareState);
    const { easingValue, sampledPoints } = generateLinearEasing({
      type: EasingType.WIGGLE,
      accuracy,
      ...params,
    });

    return {
      id,
      type: '##EasingType.WIGGLE##',
      curve: `##WiggleCurve.${curve}##`,
      params: { ...params, accuracy: accuracyString },
      output: {
        css: easingValue,
        tailwind_css: cssStringToTailwind(easingValue),
        svg_polyline: generateWiggleSVGPolyline(sampledPoints),
      },
    };
  });

  // Generate Overshoot presets
  const overshootPresets = Object.entries(overshootFunctions).flatMap(([style, curves]) => {
    return Object.entries(curves).map(([curve, params]) => {
      const shareState: EasingStateShare = {
        easingType: EasingType.OVERSHOOT,
        overshootStyle: style,
        overshootCurve: curve,
      };
      const id = encodeState(shareState);
      const { easingValue, sampledPoints } = generateLinearEasing({
        type: EasingType.OVERSHOOT,
        accuracy,
        style: style as OvershootStyleKey,
        ...params,
      });

      return {
        id,
        type: '##EasingType.OVERSHOOT##',
        style: `##OvershootStyle.${style}##`,
        curve: `##OvershootCurve.${curve}##`,
        params: { style: `##OvershootStyle.${style}##`, ...params, accuracy: accuracyString },
        output: {
          style: `##OvershootStyle.${style}##`,
          css: easingValue,
          tailwind_css: cssStringToTailwind(easingValue),
          svg_polyline: generateOvershootSVGPolyline(sampledPoints),
        },
      };
    });
  });

  // Combine all presets
  const allPresets = {
    BEZIER: bezierPresets,
    SPRING: springPresets,
    BOUNCE: bouncePresets,
    WIGGLE: wigglePresets,
    OVERSHOOT: overshootPresets,
  };

  const replacer = [
    ['"##', ''],
    ['##"', ''],
  ];

  // Write the file ./app/generated/preset-data.ts with the content of the presets
  let content = `// This file is generated by scripts/generate-preset-data.ts
// Do not modify it manually

import { BezierCurve, BezierStyle, BounceCurve, EasingType, LinearEasingAccuracy, OvershootCurve, OvershootStyle, SpringCurve, WiggleCurve } from '~/types/enums';

export const presetData = ${JSON.stringify(allPresets, null, 2)};

// Helper functions to get presets by type
export const getBezierPresets = () => presetData.BEZIER;
export const getSpringPresets = () => presetData.SPRING;
export const getBouncePresets = () => presetData.BOUNCE;
export const getWigglePresets = () => presetData.WIGGLE;
export const getOvershootPresets = () => presetData.OVERSHOOT;

export const getAllPresets = () => [
  ...presetData.BEZIER,
  ...presetData.SPRING,
  ...presetData.BOUNCE,
  ...presetData.WIGGLE,
  ...presetData.OVERSHOOT,
];

export const getPresetById = (id: string) => {
  return getAllPresets().find(preset => preset.id === id);
};
`;

  // Replace the EasingType strings with the enum values
  replacer.forEach(([searchValue, replaceValue]) => {
    content = content.replace(new RegExp(searchValue, 'g'), replaceValue);
  });

  fs.writeFileSync('./src/generated/preset-data.ts', content);

  console.log('✅ Generated preset data successfully!');
  console.log(`📊 Generated ${allPresets.BEZIER.length} bezier presets`);
  console.log(`📊 Generated ${allPresets.SPRING.length} spring presets`);
  console.log(`📊 Generated ${allPresets.BOUNCE.length} bounce presets`);
  console.log(`📊 Generated ${allPresets.WIGGLE.length} wiggle presets`);
  console.log(`📊 Generated ${allPresets.OVERSHOOT.length} overshoot presets`);
  console.log(
    `📊 Total: ${allPresets.BEZIER.length + allPresets.SPRING.length + allPresets.BOUNCE.length + allPresets.WIGGLE.length + allPresets.OVERSHOOT.length} presets`,
  );
}

main();
