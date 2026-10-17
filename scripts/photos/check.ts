/**
 * Photo safety check. Keeps the never-locate rule and the consent rules true
 * in code rather than in a README.
 *
 * Errors (exit 1):
 *  - any image under public/ carrying EXIF or XMP metadata (GPS lives there)
 *  - any image under public/images/ over 700 KB or over 2400px on its long
 *    edge (a raw camera original slipped through)
 *  - a camera original (IMG*.jpg, .heic, .dng) tracked anywhere in git, or
 *    anything tracked inside media-originals/
 *  - a lib/images.ts entry whose file is missing
 *  - an identifiable photo marked consent "not-needed", or a people-free
 *    photo carrying a consent decision (a sign the fields were mixed up)
 *
 * Warnings (exit 0):
 *  - identifiable photos still awaiting a consent decision
 *  - files under public/images/ that nothing in lib/images.ts points at
 *
 * Run via:  npm run photos:check
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import sharp from "sharp";
import { images, type MediaRef } from "@/lib/images";

const MAX_BYTES = 700 * 1024;
const MAX_EDGE = 2400;

type Issue = { level: "error" | "warn"; where: string; note: string };
const issues: Issue[] = [];
const err = (where: string, note: string) =>
  issues.push({ level: "error", where, note });
const warn = (where: string, note: string) =>
  issues.push({ level: "warn", where, note });

const walk = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });

const isImage = (f: string) => /\.(jpe?g|png|webp|avif|gif|tiff?)$/i.test(f);

async function checkFiles() {
  for (const file of walk("public").filter(isImage)) {
    const meta = await sharp(file).metadata();
    if (meta.exif || meta.xmp) {
      err(
        file,
        "carries hidden metadata (EXIF/XMP can hold GPS location). Re-add it with npm run photos:add.",
      );
    }
    if (!file.startsWith(path.join("public", "images"))) continue;
    const bytes = fs.statSync(file).size;
    if (bytes > MAX_BYTES) {
      err(file, `${Math.round(bytes / 1024)} KB is over the 700 KB limit.`);
    }
    const edge = Math.max(meta.width ?? 0, meta.height ?? 0);
    if (edge > MAX_EDGE) {
      err(
        file,
        `${edge}px long edge looks like a raw original (limit ${MAX_EDGE}px).`,
      );
    }
  }
}

function checkTracked() {
  let tracked: string[] = [];
  try {
    tracked = execFileSync("git", ["ls-files"], { encoding: "utf8" })
      .split("\n")
      .filter(Boolean);
  } catch {
    warn("git", "not a git checkout; skipped the tracked-originals check.");
    return;
  }
  for (const f of tracked) {
    const base = path.basename(f);
    if (f.startsWith("media-originals/")) {
      err(f, "media-originals/ is private and must never be committed.");
    } else if (
      /^IMG[_\d].*\.jpe?g$/i.test(base) ||
      /\.(heic|heif|dng)$/i.test(base)
    ) {
      err(
        f,
        "looks like a camera original. Keep originals out of git; use npm run photos:add.",
      );
    }
  }
}

function checkRegistry() {
  const registered = new Set<string>();
  for (const [key, entry] of Object.entries(images) as [string, MediaRef][]) {
    const where = `lib/images.ts ${key}`;
    const file = path.join("public", entry.src);
    registered.add(path.normalize(file));
    if (!entry.placeholder && !fs.existsSync(file)) {
      err(where, `points at ${entry.src}, which does not exist.`);
    }
    if (entry.people === "identifiable" && entry.consent === "not-needed") {
      err(
        where,
        'shows identifiable people, so consent cannot be "not-needed".',
      );
    }
    if (entry.people !== "identifiable" && entry.consent !== "not-needed") {
      err(
        where,
        `nobody is identifiable, so consent should be "not-needed" (is "${entry.consent}").`,
      );
    }
    if (entry.consent === "pending") {
      warn(
        where,
        `shows identifiable people${entry.children ? ", including children," : ""} and is awaiting a consent decision ("cleared" or "withheld").`,
      );
    }
  }
  for (const file of walk(path.join("public", "images")).filter(isImage)) {
    if (!registered.has(path.normalize(file))) {
      warn(
        file,
        "is not registered in lib/images.ts. Register it or delete it.",
      );
    }
  }
}

async function main() {
  await checkFiles();
  checkTracked();
  checkRegistry();

  const errors = issues.filter((i) => i.level === "error");
  const warns = issues.filter((i) => i.level === "warn");
  for (const i of [...errors, ...warns]) {
    console.log(
      `${i.level === "error" ? "ERROR" : "warn "}  ${i.where}: ${i.note}`,
    );
  }
  console.log(
    `\nphotos:check: ${errors.length} error(s), ${warns.length} warning(s) across ${Object.keys(images).length} registered photos.`,
  );
  process.exit(errors.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
