/**
 * Turn a camera original into a web-safe site photo.
 *
 *   npm run photos:add -- media-originals/IMG_1234.jpg village/path
 *
 * Writes public/images/village/path.jpg:
 *  - turned upright (camera rotation applied to the pixels)
 *  - ALL metadata removed, including GPS location, camera and timestamps
 *  - long edge resized to 2000px (never enlarged)
 *  - saved as a progressive mozjpeg at quality 80, stepping quality down for
 *    very detailed scenes (dense foliage) until it fits the 650 KB budget
 *
 * Then prints a lib/images.ts entry to paste in. Fill in `people` and
 * `consent` honestly before running `npm run photos:check`.
 *
 * Originals belong in media-originals/ (git-ignored) or private storage,
 * never in the repo: they carry location data and full-size faces.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const LONG_EDGE = 2000;
const QUALITIES = [80, 74, 68, 62];
/** Under photos:check's 700 KB limit, with headroom. */
const BUDGET_BYTES = 650 * 1024;

async function main() {
  const [source, target, ...rest] = process.argv.slice(2);
  const force = rest.includes("--force");
  if (!source || !target || !/^[a-z0-9-]+\/[a-z0-9-]+$/.test(target)) {
    console.error(
      "Usage: npm run photos:add -- <original.jpg> <group/name> [--force]\n" +
        "  e.g. npm run photos:add -- media-originals/IMG_1234.jpg village/path",
    );
    process.exit(1);
  }
  if (!fs.existsSync(source)) {
    console.error(`Not found: ${source}`);
    process.exit(1);
  }

  const out = path.join("public", "images", `${target}.jpg`);
  if (fs.existsSync(out) && !force) {
    console.error(`${out} already exists. Pass --force to replace it.`);
    process.exit(1);
  }
  fs.mkdirSync(path.dirname(out), { recursive: true });

  // sharp drops all metadata by default; .rotate() with no angle applies the
  // EXIF orientation first so the photo stays upright once that is gone.
  const encode = (quality: number) =>
    sharp(source)
      .rotate()
      .resize({
        width: LONG_EDGE,
        height: LONG_EDGE,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality, mozjpeg: true, progressive: true })
      .toBuffer({ resolveWithObject: true });

  let result = await encode(QUALITIES[0]);
  for (const q of QUALITIES.slice(1)) {
    if (result.data.length <= BUDGET_BYTES) break;
    result = await encode(q);
  }
  fs.writeFileSync(out, result.data);
  const info = { ...result.info, size: result.data.length };

  const kb = Math.round(info.size / 1024);
  const key = target
    .split(/[/-]/)
    .map((w, i) => (i === 0 ? w : w[0].toUpperCase() + w.slice(1)))
    .join("");
  const ratio = info.width >= info.height ? "4/3" : "3/4";

  console.log(
    `Wrote ${out} (${info.width}x${info.height}, ${kb} KB, no metadata)\n`,
  );
  console.log("Add to lib/images.ts, then fill in people and consent:\n");
  console.log(`  ${key}: {
    src: "/images/${target}.jpg",
    alt: "Describe exactly what is in the photo.",
    placeholder: false,
    ratio: "${ratio}",
    people: "none", // "none" | "incidental" | "identifiable"
    consent: "not-needed", // identifiable people: "cleared" | "pending" | "withheld"
  },`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
