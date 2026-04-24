import { decodeValue, encodeValue } from './encoding';
import { MINI_MAP, REVERSE_MINI_MAP } from './maps';
import { BASE62_DICTIONARY, crc8, toBase62, fromBase62 } from './crc';
import type { EasingStateShare, EasingStateValue, EasingStateShareKey } from '~/types/types';

export function encodeState(stateObj: EasingStateShare) {
  if (!stateObj || Object.keys(stateObj).length === 0) {
    return '';
  }

  const mini: Record<string, EasingStateValue> = {};

  for (const longKey of Object.keys(MINI_MAP)) {
    if (Object.prototype.hasOwnProperty.call(stateObj, longKey)) {
      const shortKey = MINI_MAP[longKey as EasingStateShareKey];
      const value = stateObj[longKey as EasingStateShareKey];
      if (!shortKey || value === undefined) {
        continue; // Skip if the key is not in MINI_MAP or value is undefined
      }
      mini[shortKey] = encodeValue(longKey as EasingStateShareKey, value);
    }
  }

  // Convert the mini object to a string representation, since all keys are single characters
  // and values are numbers or enums transformed to numbers we can remove the JSON structure
  const state = JSON.stringify(mini).replace(/["{}:,]/g, '');
  const stateWithVersionAndCrc = '0' + addCrc(state);
  return stateWithVersionAndCrc;
}

export function decodeState(shareString: string) {
  if (shareString.length < 3) throw Error('ID input is too short');

  const version = BASE62_DICTIONARY.indexOf(shareString[0]); // 0–61
  if (version < 0) throw Error('Invalid version in ID');

  const state = verifyAndStrip(shareString.slice(1));

  if (!state) throw Error('Invalid checksum in ID');

  const fullState: Partial<Record<EasingStateShareKey, EasingStateValue>> = {};
  // Split the state string into pairs of key-value characters
  // Each pair consists of a single character key and the rest as value
  const pairs = state.split(/(?=[a-zA-Z])/).filter(Boolean);
  for (const pair of pairs) {
    const [key, ...value] = pair;
    if (key && value.length > 0) {
      const fullKey = REVERSE_MINI_MAP[key];
      if (fullKey) {
        fullState[fullKey] = decodeValue(fullKey, value.join(''));
      }
    }
  }
  return fullState;
}

export function addCrc(code: string): string {
  const bytes = new TextEncoder().encode(code);
  const crc = crc8(bytes);
  return `${code}${toBase62(crc)}`;
}

export function verifyAndStrip(raw: string): string | null {
  // Letzte 2 Zeichen sind CRC
  const code = raw.slice(0, -2);
  const crcPart = raw.slice(-2);
  if (!crcPart || crcPart.length !== 2) return null;

  const crcCalc = crc8(new TextEncoder().encode(code));
  const crcSeen = fromBase62(crcPart);

  return crcCalc === crcSeen ? code : null; // null ⇒ Link korrupt
}

/**
 * Encodes keyframes text data to a base64 string for inclusion in share URLs.
 * The keyframes text is stored separately from the compact state encoding
 * because it can contain arbitrary CSS strings.
 */
export function encodeKeyframesData(keyframesCSS: string, animationPropertyValue: string): string {
  const json = JSON.stringify({ k: keyframesCSS, a: animationPropertyValue });
  // Use TextEncoder for reliable Unicode support instead of the deprecated unescape/escape pattern
  const bytes = new TextEncoder().encode(json);
  return btoa(String.fromCharCode(...bytes));
}

/**
 * Decodes keyframes text data from a base64 string produced by encodeKeyframesData.
 * Returns null if the encoded string is invalid or malformed.
 */
export function decodeKeyframesData(encoded: string): { keyframesCSS: string; animationPropertyValue: string } | null {
  try {
    // Use TextDecoder for reliable Unicode support instead of the deprecated escape pattern
    const bytes = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    const parsed: unknown = JSON.parse(json);
    if (
      parsed !== null &&
      typeof parsed === 'object' &&
      'k' in parsed &&
      'a' in parsed &&
      typeof (parsed as Record<string, unknown>).k === 'string' &&
      typeof (parsed as Record<string, unknown>).a === 'string'
    ) {
      return {
        keyframesCSS: (parsed as Record<string, string>).k,
        animationPropertyValue: (parsed as Record<string, string>).a,
      };
    }
    return null;
  } catch {
    return null;
  }
}
