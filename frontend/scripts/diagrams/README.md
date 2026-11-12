# Blog diagrams

The figures in `moving-my-app-to-aws-serverless.md`. Each is a fixed-coordinate HTML page that renders to a PNG in `frontend/public/`.

## Render

```sh
nix shell nixpkgs#chromium
./render.sh
```

`CHROME=/path/to/chrome` overrides detection. The script renders each page at 2x and overwrites the PNG the post references, so commit the PNG after a source change. Chromium needs network for the webfonts on a cold font cache; without it the fallback font changes line breaks.

## Structure

Each page is one `#canvas`:

- `.node` cards placed by inline `left`, `top`, `width`, `height`
- an SVG `#wires` layer, one path per connector
- a dashed `.vpc` and lane labels
- z-order: vpc, wires, nodes, labels

Canvas sizes live in `render.sh`. The nodes, wires and labels carry the geometry, so a change to one is a change to its coordinates.

## Editing

- Move a card and its wire in the same edit. The path coordinates are the card edges; moving one without the other detaches the arrow.
- A wire ends on a border. The arrowhead is `marker-end`, so the path stops where the line does.
- To add a node, copy a `.node` block and keep the padding, icon size and gap. Title for the name, one subtitle line for the concrete value (`multi_az = false`, `3 receives → DLQ`).
- Long subtitles are the usual breakage. Judge the render at the width the post shows it, not full size.
- Dashed wires mean scheduled work or artifact sync. Dashed borders mean network boundaries. Keep the two apart.
- Icons ride at the card's fixed size. Every card that names an AWS service gets the square service icon, never a resource outline.

## Icons

`icons/` holds the square service icons from the [AWS Architecture Icons](https://aws.amazon.com/architecture/icons/) package, 80px each. Use them under AWS's icon terms. The package has no service square for NAT Gateway, so `NAT.png` is the official resource glyph drawn white on the VPC purple. The Cloudflare mark is inline SVG from [simple-icons](https://github.com/simple-icons/simple-icons).

The general glyphs (`Client.png`, `Email.png`) stay dark line art because they are not AWS services. Do not mix the resource outline icons back in for AWS services.

## Fonts and color

Inter and JetBrains Mono, the same families the site loads, plus DejaVu fallbacks. Paper, ink, muted, accent and amber are CSS variables at the top of each page. They are diagram-local, not site tokens; the site palette owns its own values.

## Scope

The serverless page owns runtime, alarms and the probe schedule. Deploys (GitHub OIDC, ECR) and config (SSM) are not drawn. A deploy figure would own those, not this one.
