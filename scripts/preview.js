#!/usr/bin/env node
import { readFileSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const palette = JSON.parse(readFileSync(join(root, "palette/dark.json"), "utf8")).colors;

const RESET = "\x1b[0m";

const rgb = (hex) => {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
};

const fg = (name, text) => {
  const [r, g, b] = rgb(palette[name]);
  return `\x1b[38;2;${r};${g};${b}m${text}${RESET}`;
};
const bold = (text) => `\x1b[1m${text}\x1b[22m`;
const dim = (text) => fg("subtext", text);

const prompt = `${bold(fg("green", "➜"))} `;
const cwd = `${bold(fg("cyan", "muah"))} ${dim("on")} ${bold(fg("pink", "⌥ main"))}`;

const lines = [
  `${cwd}\n${prompt}${fg("green", "git")} ${fg("green", "diff")} ${fg("accent_blue", "palette/dark.json")}`,
  `${fg("cyan", "@@ -47,7 +47,7 @@")}`,
  `${fg("text", "   \"purple\":       \"#b59cea\",")}`,
  `${fg("red", "-  \"pink\":         \"#ed8aaf\",")}`,
  `${fg("green", "+  \"pink\":         \"#ef8fb4\",")}`,
  `${fg("text", "   \"rose\":         \"#e088b0\",")}`,
  ``,
  `${cwd}\n${prompt}${bold(fg("pink", "for"))} ${fg("text", "f")} ${bold(fg("pink", "in"))} ${fg("orange", "ports/*/muah.*")}${fg("red", ";")} ${bold(fg("pink", "do"))} ${fg("purple", "echo")} ${fg("string_blue", `"✓ built $f"`)}${fg("red", ";")} ${bold(fg("pink", "done"))}`,
  fg("text", `✓ built ports/fzf/muah.opts`),
  fg("text", `✓ built ports/tmux/muah.tmux.conf`),
  fg("text", `✓ built ports/windows-terminal/muah.json`),
  fg("text", `✓ built ports/zed/muah.json`),
  fg("text", `✓ built ports/zsh/muah.zsh`),
  ``,
  `${cwd}\n${prompt}${fg("green", "npm")} ${fg("green", "run")} ${fg("text", "build")} ${fg("red", "&&")} ${fg("green", "cp")} ${fg("accent_blue", "ports/zed/muah.json")} ${fg("text", "~/.config/zed/themes/")}`,
];

const ansi = lines.join("\n") + "\n";

const outDir = join(root, "assets");
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "preview.svg");

const args = [
  "--output", outPath,
  "--background", palette.crust,
  "--padding", "8,18",
  "--margin", "0",
  "--border.radius", "0",
  "--font.family", "JetBrains Mono",
  "--font.size", "14",
  "--line-height", "1.45",
];

const result = spawnSync("freeze", args, { input: ansi, stdio: ["pipe", "inherit", "inherit"] });
if (result.status !== 0) process.exit(result.status ?? 1);
console.log(`wrote ${outPath.replace(root + "/", "")}`);
