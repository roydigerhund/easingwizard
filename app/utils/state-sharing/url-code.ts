import { EasingStateShare, EasingStateShareKey, EasingStateValue } from '~/types-and-enums';
import { ALPHABET, crc8, fromBase62, toBase62 } from './crc';
import { decodeValue, encodeValue } from './encoding';
import { MINI_MAP, REVERSE_MINI_MAP } from './maps';

export function encodeState(stateObj: EasingStateShare) {
  if (!stateObj || Object.keys(stateObj).length === 0) {
    return '';
  }

  const mini: Record<string, EasingStateValue> = {};

  for (const [key, value] of Object.entries(stateObj)) {
    const shortKey = MINI_MAP[key as EasingStateShareKey];
    if (shortKey) {
      mini[shortKey] = encodeValue(key as EasingStateShareKey, value);
    }
  }

  // Convert the mini object to a string representation, since all keys are single characters
  // and values are numbers or enums transformed to numbers we can remove the JSON structure
  const state = JSON.stringify(mini).replace(/["{}:,]/g, '');
  const stateWithVersionAndCrc = '0' + addCrc(state);
  return stateWithVersionAndCrc;
}

export function decodeState(shareString: string) {
  if (shareString.length < 3) throw Error('too short');

  const version = ALPHABET.indexOf(shareString[0]); // 0–61
  if (version < 0) throw Error('invalid version');

  const state = verifyAndStrip(shareString.slice(1));

  const fullState: Partial<Record<EasingStateShareKey, EasingStateValue>> = {};
  if (!state || typeof state !== 'string') return fullState;
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
