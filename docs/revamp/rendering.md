# Certificate rendering spec

Two renderers draw certificates: the browser preview (`apps/web`) and the server (`apps/api/src/certinova_api/rendering`). They must give the same result. Follow these rules in both. The server code is the reference: `text_fit.py` and `renderer.py`.

## Coordinates

- Field boxes (`x`, `y`, `width`, `height`) are in natural image pixels of the template image.
- If the background image is a different size from `image_width` × `image_height`, scale each box by `actual / expected` on each axis. Scale the maximum font size by the horizontal factor.

## Text fields

| Field | Text | Maximum font size (px) |
|---|---|---|
| `recipient_name` | Recipient name | 100 |
| `rank` | Rank. Draw nothing if the recipient has no rank | 150 |
| `organisation_name` | Organisation name at render time | 72 |
| `certificate_link` | Certificate id (UUID) | 24 |

Fit the text with these steps:

1. `size = min(box.width / (len(text) × 0.6), box.height × 0.8, max_size)`.
2. `size = max(size, 8)`.
3. Measure the text at `size`. Width is the advance width (canvas `measureText().width`). Ascent is the distance from the baseline to the top of the glyphs (canvas `actualBoundingBoxAscent`).
4. If `width > box.width × 0.9` or `size > box.height × 0.8`: multiply `size` by `min(box.width × 0.9 / width, box.height × 0.8 / size)` and measure again. Do this one time only.
5. Draw with a left-baseline anchor at `x = box.x + (box.width − width) / 2`, `y = box.y + (box.height + ascent) / 2`.
6. Underline: a line from `(x, y + 2)` to `(x + width, y + 2)`, thickness `max(1, round(size / 20))`, same colour as the text.

Font: `fonts.render_family` for the field's `font_family`, weight 700 if bold, else 400, italic if set. If the variant does not exist, use the regular variant of the same family. Do not let the browser make a fake bold or italic.

### Fonts in the browser

The server uses Debian font packages for system fonts. The browser loads metric-compatible copies from Google Fonts instead:

| `render_family` | Browser font |
|---|---|
| Liberation Sans | Arimo |
| Liberation Serif | Tinos |
| DejaVu Sans Mono | Cousine |
| DejaVu Sans | Installed copy, else Verdana (not on Google Fonts, small drift possible) |

The browser asks the Google Fonts CSS API (`/css?family=<name>:400,700,400italic,700italic`) one time for each family. It returns only the variants that exist, so the browser knows when to fall back to the regular variant. Do not use `/css2` for this: it answers 400 with no CORS header when one variant is missing.

## QR code

- Content: `<FRONTEND_URL>/verify/<certificate id>`.
- Border: 1 module. Black on white.
- Size: `min(box.width, box.height) × 0.8`, square, centred in the box, nearest-neighbour scaling.

## Output

PNG, RGB, the same size as the background image.
