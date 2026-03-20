# SantyCSS Inspector — Figma Plugin

Inspect any Figma layer and instantly get the matching **SantyCSS** utility classes.

## What it does

Select a frame, component, or text layer in Figma → the plugin shows you the exact SantyCSS classes for:

| Property | Classes generated |
|---|---|
| Auto-layout direction | `make-flex flex-row` / `flex-column` |
| Alignment | `justify-center`, `align-center`, `justify-between` |
| Gap | `gap-16`, `gap-24` |
| Padding | `add-padding-24`, `add-padding-x-16 add-padding-y-8` |
| Width / height | `set-width-320`, `set-width-full`, `set-height-fit` |
| Border radius | `round-corners-8`, `make-pill` |
| Border | `add-border-1`, `border-color-blue-500` |
| Fill / background | `background-blue-500`, `background-gray-50` |
| Text color | `color-gray-900` |
| Font size | `set-text-16` |
| Font weight | `text-bold`, `text-semibold` |
| Text align | `text-center`, `text-right` |
| Drop shadow | `add-shadow-sm`, `add-shadow-lg` |
| Opacity | `opacity-50` |
| Overflow | `overflow-hidden` |

## Install locally (development)

1. Open Figma Desktop
2. Go to **Plugins → Development → Import plugin from manifest…**
3. Select the `manifest.json` file in this folder
4. The plugin appears under **Plugins → Development → SantyCSS Inspector**

## File structure

```
figma-plugin-santycss/
├── manifest.json   — Plugin config (name, api version, entry points)
├── code.js         — Runs in Figma sandbox, reads node properties
├── ui.html         — Plugin window UI (iframe)
└── README.md
```

## Publish to Figma Community

1. Create a Figma account at figma.com
2. Go to **Community → Publish a plugin**
3. Fill in name, description, cover image
4. Upload the plugin files — Figma will review and publish

## How color matching works

The plugin converts Figma's RGBA (0–1 range) to the closest SantyCSS palette color using Euclidean distance in RGB space across all 20 color families × 10 shades (200 colors total). The closest match is used.
