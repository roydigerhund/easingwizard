import { EasingStateValue } from '~/types-and-enums';
import { easingStateEnumMaps } from './maps';

// we only have numbers and enums
export function encodeValue(key: keyof typeof easingStateEnumMaps, value: EasingStateValue): EasingStateValue {
  if (key in easingStateEnumMaps && easingStateEnumMaps[key]) {
    return easingStateEnumMaps[key].toIdx[value as string];
    // if number is 0.* or -0.*, we convert it to a string and remove the leading zero
  } else if (typeof value === 'number' && /^-?0\.\d+$/.test(value.toString())) {
    return value.toString().replace(/0\./, '.'); // Convert to string and remove leading zero
  } else {
    return value;
  }
}

// we only have numbers and enums
export function decodeValue(key: keyof typeof easingStateEnumMaps, value: EasingStateValue): EasingStateValue {
  if (key in easingStateEnumMaps && easingStateEnumMaps[key]) {
    return easingStateEnumMaps[key].toEnum[value as number];
  } else if (typeof value === 'string' && /^-?\d*\.?\d+$/.test(value)) {
    return +value; // Convert numeric strings to numbers
  } else {
    return value;
  }
}
