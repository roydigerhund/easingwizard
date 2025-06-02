// Polynom 0x07, Init 0x00, kein Reflect, kein Final-XOR
export function crc8(buf: Uint8Array, poly = 0x07): number {
  let crc = 0x00;

  for (const byte of buf) {
    crc ^= byte; // 8 Bits einmischen
    for (let i = 0; i < 8; i++) {
      crc =
        crc & 0x80
          ? ((crc << 1) ^ poly) & 0xff // MSB gesetzt → XOR mit Polynom
          : (crc << 1) & 0xff; // sonst nur shiften
    }
  }
  return crc; // 0 – 255
}

export const BASE62_DICTIONARY = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function toBase62(n: number): string {
  const hi = Math.floor(n / 62);
  const lo = n % 62; // 0‒61
  return BASE62_DICTIONARY[hi] + BASE62_DICTIONARY[lo]; // always two chars
}

export function fromBase62(s: string): number {
  const hi = BASE62_DICTIONARY.indexOf(s[0]);
  const lo = BASE62_DICTIONARY.indexOf(s[1]);
  if (hi === -1 || lo === -1) throw new Error('Invalid base-62 chars');
  return hi * 62 + lo;
}
