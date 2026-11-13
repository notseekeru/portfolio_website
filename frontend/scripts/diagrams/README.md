# Blog diagrams

The figures in `moving-my-app-to-aws-serverless.md`. Each is a fixed-coordinate HTML page that renders to a PNG in `frontend/public/`.

## Render

```sh
nix shell nixpkgs#chromium
./render.sh
```

`CHROME=/path/to/chrome` overrides detection. The script renders each page at 2x and overwrites the PNG the post references, so commit the PNG after a source change. Chromium needs network for the webfonts on a cold font cache; without it the fallback font changes line breaks.

## Structure

Each page is one `#canvas`. Fixed coordinates instead of a layout engine: the arrows are hand-routed, and a reflow would move cards away from their paths.

- `.node` cards placed by inline `left`, `top`, `width`, `height`
- an SVG `#wires` layer, one path per connector
- a dashed `.vpc` and lane labels
- z-order: vpc, wires, nodes, labels

Canvas sizes live in `render.sh`. The size passed there, the `#canvas` width/height and the SVG `viewBox` are one value written in three places; change all three together or the screenshot crops. The nodes, wires and labels carry the geometry, so a change to one is a change to its coordinates.

Open a page in a browser before rendering. The canvas is already at final size, so what you see is the layout minus the 2x export.

The pages are screenshot sources, not app pages: Biome skips this folder so app-level accessibility rules do not flag them.

## Editing

- Move a card and its wire in the same edit. The path coordinates are the card edges; moving one without the other detaches the arrow.
- A wire ends on a border. The arrowhead is `marker-end`, so the path stops where the line does.
- Solid strokes are request and data paths. Dashed amber is scheduled work or an artifact sync, such as the probe and the S3 dist sync. Dashed ink borders are network boundaries.
- Long subtitles are the usual breakage. Judge the render at the width the post shows it, not full size.
- Icons ride at the card's fixed size. Every card that names an AWS service gets the square service icon, never a resource outline.

A card and its wire:

```html
<div class="node" style="left:360px; top:520px; width:236px; height:80px; align-items:center;">
    <img src="icons/SQS.png" alt="" />
    <div>
        <div class="title">SQS review queue</div>
        <div class="sub">3 receives → DLQ</div>
    </div>
</div>
```

```html
<path d="M360,560 H284" marker-end="url(#arrow)" />
```

Title for the service, one subtitle for the concrete value. Add a `.label` only when the line alone does not say the relationship.

## Icons

`icons/` holds the square service icons from the [AWS Architecture Icons](https://aws.amazon.com/architecture/icons/) package, 80px each. Use them under AWS's icon terms. The vendored set has no service square for NAT Gateway, so `NAT.png` is the official 48px resource SVG with its fill switched to white, scaled 1.18x and centered on an 80px `#8C4FFF` square. The Cloudflare mark is inline SVG from [simple-icons](https://github.com/simple-icons/simple-icons).

The general glyphs (`Client.png`, `Email.png`) stay dark line art because they are not AWS services. Do not mix the resource outline icons back in for AWS services. To add a service, take its 80px `Arch_*_64.png` from the package's `Architecture-Service-Icons` folder and save it as `icons/<Service>.png`.

## Fonts and color

Inter and JetBrains Mono, the same families the site loads, plus DejaVu fallbacks. Paper is the background, ink the text, muted the secondary lines, accent the edge or replacement, amber the scheduled path. The values are CSS variables at the top of each page. They are diagram-local, not site tokens; the site palette owns its own values.

## Scope

The serverless page owns runtime, alarms and the probe schedule. Deploys (GitHub OIDC, ECR) and config (SSM) are not drawn. A deploy figure would own those, not this one.

The labels follow the stack behind the post and the rates in its cost table (`multi_az = false`, `maxReceiveCount = 3`). Do not add a service the stack does not run.
