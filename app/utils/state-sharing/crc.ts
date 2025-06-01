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

export const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function toBase62(n: number): string {
  return ALPHABET[n >> 6] + ALPHABET[n & 0x3f]; // 0…63 je Zeichen
}

export function fromBase62(s: string): number {
  return (ALPHABET.indexOf(s[0]) << 6) | ALPHABET.indexOf(s[1]);
}
