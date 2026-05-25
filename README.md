# muah

A cross-platform theme. Dark only for now.

Currently ships ports for:
- **Zed** (`ports/zed/muah.json`)
- **Windows Terminal** (`ports/windows-terminal/muah.json`)

## Install

### Zed

Copy `ports/zed/muah.json` into Zed's user themes directory, then pick **muah** from the theme selector.

```
mkdir -p ~/.config/zed/themes
cp ports/zed/muah.json ~/.config/zed/themes/muah.json
```

### Windows Terminal

Open `settings.json` (Ctrl+, → "Open JSON file"), find the top-level `"schemes"` array, and paste the entire object from `ports/windows-terminal/muah.json` into it. Then set `"colorScheme": "muah"` on a profile.

## Iteration loop

After the one-time install above:

```
# edit palette/dark.json (or templates/*)
npm run build && cp ports/zed/muah.json ~/.config/zed/themes/muah.json
# Zed picks up the change automatically
```

## Project layout

```
palette/dark.json              single source of truth — named hex values
templates/                     per-app templates with {{token}} placeholders
ports/                         generated output (do not edit by hand)
scripts/build.js               zero-dep Node generator
```

## Building

```
npm run build
```

Reads `palette/dark.json`, expands every template in `templates/`, writes the result to the matching path under `ports/`.

## Contributing

Edit `palette/dark.json` or any file in `templates/`, then run `npm run build` and commit the regenerated `ports/`.

The build script supports two token forms:
- `{{name}}` — resolves to the palette hex (with `ff` alpha for hex-based formats).
- `{{name:XX}}` — overrides the alpha byte (e.g. `{{red:1a}}` → `#ff7b721a`).
