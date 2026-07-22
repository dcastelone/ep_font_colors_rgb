# ep_font_colors_rgb

Arbitrary RGB and hexadecimal text colors for Etherpad, with backward-compatible support for the storage format used by `ep_font_color`.

![RGB font color picker in Etherpad](https://i.imgur.com/OE4m0S7.png)

## Features

- Compact color picker with hexadecimal input
- Normalization to lowercase `#rrggbb` values
- Validation of user-provided color values
- Outside-click dismissal across Etherpad's editor frames
- Import and content-collection support
- Compatibility with historical named `ep_font_color` values

## Installation

Remove `ep_font_color` before installing this package; both plugins provide the same editor control and attribute family.

From the Etherpad directory:

```sh
pnpm run plugins i ep_font_colors_rgb
```

Restart Etherpad after installation. This release supports Etherpad 3.3.2 and later 3.x releases on Node.js 20 or newer.

## Compatibility

The plugin continues to use Etherpad's `color` attribute:

- Historical named values: `black`, `red`, `green`, `blue`, `yellow`, and `orange`
- New values: six-digit hexadecimal colors such as `#0a141e`
- Imported CSS colors such as `rgb(10, 20, 30)`: normalized to hexadecimal

Existing pads using the official palette therefore continue to render without data migration.

## Development

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm lint
```

This package was derived from Etherpad's `ep_font_color` plugin by John McLear and other contributors. It is licensed under the Apache License 2.0; see `LICENSE`.
