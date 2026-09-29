// Node script to generate valid PNG icon files without external dependencies
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createSolidPng(width, height, r, g, b, a = 255) {
  // Create raw RGBA buffer with filter byte 0 per line
  const rowBytes = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowBytes);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.45;
  const innerRadius = width * 0.42;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    rawData[rowOffset] = 0; // Filter type None

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Deep green base (#173B2D: 23, 59, 45)
      let pr = 23;
      let pg = 59;
      let pb = 45;
      let pa = 255;

      // Outer gold circle (#D4AF37: 212, 175, 55)
      if (Math.abs(dist - radius) <= width * 0.02) {
        pr = 212;
        pg = 175;
        pb = 55;
      } else if (dist <= innerRadius) {
        // Darker green inside (#0B1F1C: 11, 31, 28)
        pr = 11;
        pg = 31;
        pb = 28;

        // Lighthouse tower shape simplified in center
        const tw = width * 0.12;
        const th = height * 0.4;
        const topY = cy - th * 0.55;
        const botY = cy + th * 0.55;

        if (y >= topY && y <= botY) {
          // Tower tapering
          const progress = (y - topY) / th;
          const currentWidth = tw * (0.6 + progress * 0.6);
          if (Math.abs(x - cx) <= currentWidth / 2) {
            // White tower (#FFFFFF)
            pr = 255;
            pg = 255;
            pb = 255;

            // Stripes (#173B2D)
            if (
              (progress >= 0.25 && progress <= 0.4) ||
              (progress >= 0.65 && progress <= 0.8)
            ) {
              pr = 23;
              pg = 59;
              pb = 45;
            }
          }
        }

        // Lantern beacon yellow (#F3D21A: 243, 210, 26)
        if (Math.hypot(x - cx, y - (topY - 8)) <= width * 0.05) {
          pr = 243;
          pg = 210;
          pb = 26;
        }

        // Rays of light
        if (y < cy && Math.abs(x - cx) > width * 0.15 && Math.abs(x - cx) < width * 0.38) {
          const rayAngle = Math.atan2(y - (topY - 8), Math.abs(x - cx));
          if (rayAngle > -0.6 && rayAngle < 0.3) {
            pr = Math.min(255, pr + 60);
            pg = Math.min(255, pg + 50);
            pb = Math.min(255, pb + 10);
          }
        }
      }

      rawData[pixelOffset] = pr;
      rawData[pixelOffset + 1] = pg;
      rawData[pixelOffset + 2] = pb;
      rawData[pixelOffset + 3] = pa;
    }
  }

  // Compress IDAT
  const compressed = zlib.deflateSync(rawData);

  // CRC32 implementation
  const crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    crcTable[n] = c;
  }

  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(12 + len);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    const crc = crc32(buf.subarray(4, 8 + len));
    buf.writeUInt32BE(crc, 8 + len);
    return buf;
  }

  // PNG Header
  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth: 8
  ihdrData[9] = 6; // Color type: RGBA
  ihdrData[10] = 0; // Compression
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace
  const ihdr = makeChunk('IHDR', ihdrData);

  // IDAT Chunk
  const idat = makeChunk('IDAT', compressed);

  // IEND Chunk
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdr, idat, iend]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate PWA icons
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createSolidPng(192, 192));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createSolidPng(512, 512));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createSolidPng(512, 512));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createSolidPng(180, 180));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createSolidPng(64, 64));

console.log('Successfully generated all PWA icons in /public');
