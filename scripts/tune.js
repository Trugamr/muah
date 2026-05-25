#!/usr/bin/env node
/**
 * Tune helper — generates a per-target overlay palette by applying an HSL
 * transform to the base palette. Use this to bootstrap a new port's overlay
 * (e.g. to compensate for a flatter renderer like Windows Terminal), then
 * hand-tune outliers in the resulting file.
 *
 * Usage:
 *   node scripts/tune.js [--saturate=0.10] [--lighten=-0.05] [--out=palette/dark.windows-terminal.json]
 *
 * Defaults:
 *   --saturate  0.10   (+10% saturation; negative desaturates)
 *   --lighten   -0.05  (-5% lightness; positive lifts toward white)
 *   --out       palette/dark.windows-terminal.json
 *
 * Surface tokens (mantle/crust/etc.) are skipped so backgrounds stay put.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

const SKIP = new Set([
  "transparent", "mantle", "crust",
  "surface0", "surface1", "surface2",
  "overlay0", "overlay1",
  "subtext", "text", "white",
]);

/** @param {string[]} argv */
function parseArgs(argv) {
  /** @type {Record<string, string>} */
  const out = {};
  for (const a of argv) {
    const m = /^--([a-z-]+)(?:=(.+))?$/i.exec(a);
    if (m) out[m[1]] = m[2] ?? "true";
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));
const satDelta = Number(args.saturate ?? 0.10);
const lightDelta = Number(args.lighten ?? -0.05);
const outRel = args.out ?? "palette/dark.windows-terminal.json";

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

function hexToRgb(hex) {
  const h = hex.replace(/^#/, "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function rgbToHex([r, g, b]) {
  const x = (n) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
  return `#${x(r)}${x(g)}${x(b)}`;
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, s, l];
}

function hslToRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60)       [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else              [r, g, b] = [c, 0, x];
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

function tune(hex) {
  const [h, s, l] = rgbToHsl(...hexToRgb(hex));
  const s2 = clamp(s + satDelta, 0, 1);
  const l2 = clamp(l + lightDelta, 0, 1);
  return rgbToHex(hslToRgb(h, s2, l2));
}

const base = JSON.parse(readFileSync(join(root, "palette/dark.json"), "utf8"));

/** @type {Record<string, string>} */
const tunedColors = {};
for (const [name, hex] of Object.entries(base.colors)) {
  if (SKIP.has(name)) continue;
  const tuned = tune(hex);
  if (tuned.toLowerCase() !== String(hex).toLowerCase()) tunedColors[name] = tuned;
}

const outAbs = isAbsolute(outRel) ? outRel : join(root, outRel);
writeFileSync(outAbs, JSON.stringify({ colors: tunedColors }, null, 2) + "\n");
console.log(`wrote ${outRel} (${Object.keys(tunedColors).length} tokens, saturate=${satDelta}, lighten=${lightDelta})`);
