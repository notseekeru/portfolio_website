# Blog diagrams

The figures used across the blog posts. Each is a fixed-coordinate HTML page that renders to a PNG in `frontend/public/`.

## Render

```sh
nix shell nixpkgs#chromium
./render.sh
```

`CHROME=/path/to/chrome` overrides detection. The script renders each page at 2x and overwrites the PNG the post references, so commit the PNG after a source change. Chromium needs network for the webfonts on a cold font cache; without it the fallback font changes line breaks. A re-render can shift antialiasing by a hair even when the source did not change; check before committing a stray PNG diff.

The post uses the output as `![alt](/name.png)` in place of its Mermaid block; the alt describes the flow, not the file. Add the page to `render.sh`; that file owns the page-to-PNG map and the canvas size.

## Figure types

- Stack: a zone or column per layer, cards with AWS squares or brand marks. Use it for a topology.
- Flow: a vertical chain or a snake, `.step` cards with line icons, loops on the margin, `.note` beside the card it constrains. Use it for a procedure.
- Comparison: a few cards plus a scaled bar, numbers on the cards. Use it when the claim is a ratio.
- Ladder: a shared axis with one track per config, solid to the last pass, hatched to the first fail. Use it when the claim is where a system stops.

The canvas is the label budget. The post shows it at prose width, so a wider canvas buys layout room and costs type size; match the width to the density and check at post width. Start from the closest existing page; its CSS is the template.

## Structure

Each page is one `#canvas`. Fixed coordinates instead of a layout engine: the arrows are hand-routed, and a reflow would move cards away from their paths.

- `.node` for stack cards, `.step` for flow cards, `.note` for constraints, placed by inline `left`, `top`, `width`, `height`
- an SVG `#wires` layer, one path per connector
- a dashed `.vpc` or `.zone` with a `.zone-label` pill or lane labels
- z-order: zone, wires, cards, labels

Canvas sizes live in `render.sh`. The size passed there, the `#canvas` width/height and the SVG `viewBox` are one value written in three places; change all three together or the screenshot crops. The nodes, wires and labels carry the geometry, so a change to one is a change to its coordinates. Do not wrap the page in a scaled stage to fit more content; grow the canvas and move the geometry. A scale hides the mismatch between canvas, viewBox and render size.

Open a page in a browser before rendering. The canvas is already at final size, so what you see is the layout minus the 2x export.

The pages are screenshot sources, not app pages: Biome skips this folder so app-level accessibility rules do not flag them.

## Editing

- Move a card and its wire in the same edit. The path coordinates are the card edges; moving one without the other detaches the arrow.
- A wire ends on a border. The arrowhead is `marker-end`, so the path stops where the line does.
- Solid strokes are request and data paths. Dashed amber is scheduled work or an artifact sync, such as the probe and the S3 dist sync. Dashed ink borders are network boundaries. Dotted muted links are constraints or detail callouts.
- Long subtitles are the usual breakage. Judge the render at the width the post shows it, not full size.
- Icons ride at the card's fixed size. Every card that names an AWS service gets the square service icon, never a resource outline.
- Flow cards are `.step`, with the icon in the left padding; `.note` is the constraint variant and `.decide` the amber-edged decision. Copy an existing flow page when starting one.

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

`icons/` holds the square service icons from the [AWS Architecture Icons](https://aws.amazon.com/architecture/icons/) package, 80px each. Use them under AWS's icon terms. The vendored set has no service square for NAT Gateway, so `NAT.png` is the official 48px resource SVG with its fill switched to white, scaled 1.18x and centered on an 80px `#8C4FFF` square.

Stack figures give non-AWS tools their brand mark from [simple-icons](https://github.com/simple-icons/simple-icons) at the same 26px slot, brand colour written into the SVG; Cloudflare is inline. Flow figures use a line icon from [Lucide](https://lucide.dev) at the same slot, stroke set to ink. A few icons carry a semantic stroke: green for start, confirm, sync and playback, amber for decisions, cost and migrations, red for the webhook, aborts and blocked constraints.

The general glyphs (`Client.png`, `Email.png`) stay dark line art because they are not AWS services. Do not mix the resource outline icons back in for AWS services. To add a service, take its 80px `Arch_*_64.png` from the package's `Architecture-Service-Icons` folder and save it as `icons/<Service>.png`.

Fetch a brand or line mark from `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/<slug>.svg` or `https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/<slug>.svg`, set `fill` for a brand or `stroke` for a line icon, and save it under `icons/brands/` or `icons/line/`. The semantic stroke lives in the SVG, not the page CSS.

## Fonts and color

Inter and JetBrains Mono, the same families the site loads, plus DejaVu fallbacks. Paper is the background, ink the text, muted the secondary lines, accent the edge or replacement, amber the scheduled path. The values are CSS variables at the top of each page. They are diagram-local, not site tokens; the site palette owns its own values.

## Scope

For the serverless page, the GitHub OIDC deploy role and the CD push to ECR are not drawn; a deploy figure for that stack would own them. SSM config and ECR images have their own cards.

Labels and values follow the stack each post describes. Do not add a service that stack does not run.

## Before committing

- Look at the whole PNG at post width: new cards carry their icons, and no note or footer shares a card's rows.
- Size check: the canvas, the SVG viewBox and the render size agree, with no scaled wrapper.
- Diff check: only the pages and PNGs you meant. A PNG change with no source change is antialiasing.
