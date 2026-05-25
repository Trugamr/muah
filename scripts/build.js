#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * @typedef {{ name: string, appearance: string, colors: Record<string, string> }} Palette
 * @typedef {(text: string, palette: Palette) => string} Renderer
 * @typedef {{ template: string, out: string, render: Renderer }} Target
 */

const root = dirname(dirname(fileURLToPath(import.meta.url)));

const TOKEN = /\{\{([a-zA-Z0-9_]+)(?::([0-9a-fA-F]{2}))?\}\}/g;

/**
 * @param {(hex: string, alpha: string | undefined) => string} format
 * @returns {Renderer}
 */
const renderer = (format) => (text, palette) =>
  text.replace(TOKEN, (_m, name, alpha) => {
    const hex = palette.colors[name];
    if (!hex) throw new Error(`unknown palette token: ${name}`);
    return format(hex, alpha);
  });

const renderHex  = renderer((hex, alpha) => `${hex}${(alpha ?? "ff").toLowerCase()}`);
// 6-char hex (no alpha) — for formats like Windows Terminal that don't accept alpha in scheme colors.
const renderHex6 = renderer((hex) => hex);

/** @type {Target[]} */
const targets = [
  { template: "zed.json",              out: "ports/zed/muah.json",              render: renderHex },
  { template: "windows-terminal.json", out: "ports/windows-terminal/muah.json", render: renderHex6 },
  { template: "tmux.conf",             out: "ports/tmux/muah.tmux.conf",        render: renderHex6 },
  { template: "fzf.opts",              out: "ports/fzf/muah.opts",              render: renderHex6 },
  { template: "zsh.zsh",               out: "ports/zsh/muah.zsh",               render: renderHex6 },
];

/**
 * Load the base palette and, if present, merge a per-target overlay.
 * Overlay path convention: palette/dark.<templateBasename>.json (e.g. palette/dark.windows-terminal.json).
 * @param {string} template
 * @returns {Palette}
 */
function loadPalette(template) {
  /** @type {Palette} */
  const base = JSON.parse(readFileSync(join(root, "palette/dark.json"), "utf8"));
  const targetName = template.replace(/\.[^.]+$/, "");
  const overlayPath = join(root, `palette/dark.${targetName}.json`);
  if (!existsSync(overlayPath)) return base;
  const overlay = JSON.parse(readFileSync(overlayPath, "utf8"));
  return { ...base, colors: { ...base.colors, ...(overlay.colors ?? {}) } };
}

const templatesDir = join(root, "templates");
const available = new Set(readdirSync(templatesDir));

for (const t of targets) {
  if (!available.has(t.template)) continue;
  const palette = loadPalette(t.template);
  const src = readFileSync(join(templatesDir, t.template), "utf8");
  const out = t.render(src, palette);
  const outPath = join(root, t.out);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, out);
  console.log(`wrote ${t.out}`);
}
