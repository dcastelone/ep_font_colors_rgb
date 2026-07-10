# ep_font_colors_rgb

Etherpad text color plugin with a full RGB/hex color picker.

This plugin is intentionally compatible with the official `ep_font_color`
storage format. It continues to use Etherpad's `color::<value>` attribute, so
existing pads that contain values such as `color::red`, `color::blue`, or
`color::orange` continue to render. New colors are normalized to `#rrggbb`.

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
