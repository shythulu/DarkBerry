// A minimal RGBA PNG writer with a few drawing helpers, used by build.mjs to render the
// fallback preview, logo and footer images under assets/. Node's zlib is the only
// dependency, so the build stays dependency-free.
import zlib from "node:zlib";

const CRC = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
const crc32 = (buf) => { let c = -1; for (const b of buf) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ -1) >>> 0; };
const chunk = (type, data) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
};

export class Canvas {
  constructor(width, height) { this.w = width; this.h = height; this.px = new Uint8Array(width * height * 4); }
  static hex(h) { const n = parseInt(h.slice(1, 7), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  set(x, y, [r, g, b], a = 1) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    const i = (y * this.w + x) * 4, p = this.px, a0 = p[i + 3] / 255, out = a + a0 * (1 - a);
    if (out === 0) return;
    for (let k = 0; k < 3; k++) p[i + k] = Math.round(([r, g, b][k] * a + p[i + k] * a0 * (1 - a)) / out);
    p[i + 3] = Math.round(out * 255);
  }
  rect(x, y, w, h, hex) { const c = Canvas.hex(hex); for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) this.set(i, j, c); }
  // A filled circle, or a sector of one when a0/a1 (radians, clockwise from 12 o'clock) are given; 4x4 supersampled edges.
  circle(cx, cy, r, hex, a0 = 0, a1 = Math.PI * 2) {
    const c = Canvas.hex(hex), S = 4;
    for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++) for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) {
      let hit = 0;
      for (let sy = 0; sy < S; sy++) for (let sx = 0; sx < S; sx++) {
        const dx = x + (sx + 0.5) / S - cx, dy = y + (sy + 0.5) / S - cy;
        if (dx * dx + dy * dy > r * r) continue;
        const a = (Math.atan2(dx, -dy) + Math.PI * 2) % (Math.PI * 2);
        if (a >= a0 && a < a1) hit++;
      }
      if (hit) this.set(x, y, c, hit / (S * S));
    }
  }
  png() {
    const raw = Buffer.alloc((this.w * 4 + 1) * this.h);
    for (let y = 0; y < this.h; y++) { raw[y * (this.w * 4 + 1)] = 0; Buffer.from(this.px.buffer, y * this.w * 4, this.w * 4).copy(raw, y * (this.w * 4 + 1) + 1); }
    const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(this.w, 0); ihdr.writeUInt32BE(this.h, 4); ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
    return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
  }
}
