# ep_font_colors_rgb

Etherpad text color plugin with a full RGB/hex color picker.

This plugin is intentionally compatible with the official `ep_font_color`
storage format. It continues to use Etherpad's `color::<value>` attribute, so
existing pads that contain values such as `color::red`, `color::blue`, or
`color::orange` continue to render. New colors are normalized to `#rrggbb`.

## Attribution

This package was initially derived from the official Etherpad
[`ep_font_color`](https://github.com/ether/ep_font_color) plugin. The original
plugin package lists John McLear as its author and is licensed under the Apache
License 2.0. The original fixed-palette behavior, attribute naming,
localization structure, and export/import hook patterns provided the
compatibility baseline for this plugin.

`ep_font_colors_rgb` is an independent package and repository, not a fork of the
upstream GitHub repository. It is intended to replace `ep_font_color` when a
full RGB/hex text color picker is needed while preserving existing pad content.

## Install

After publishing to npm:

```sh
pnpm run plugins i ep_font_colors_rgb
```

Do not install this alongside `ep_font_color`; it is intended to replace it.

## Development

Inside an Etherpad checkout:

```sh
pnpm run plugins i ep_font_colors_rgb
```

For local unpublished testing, use a local package install workflow or publish
a prerelease first. Etherpad 3.3.x records active plugins in
`var/installed_plugins.json`, so a raw symlink into `src/plugin_packages` is not
enough to activate an unpublished plugin.

## Compatibility

- Attribute name: `color`
- Legacy named values: `black`, `red`, `green`, `blue`, `yellow`, `orange`
- New values: `#rrggbb`
- Imported inline CSS such as `style="color: rgb(10, 20, 30)"` is normalized.
