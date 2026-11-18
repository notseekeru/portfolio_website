#!/bin/sh
set -eu
cd "$(dirname "$0")"

CHROME=${CHROME:-}
if [ -z "$CHROME" ]; then
    for candidate in chromium chromium-browser google-chrome google-chrome-stable; do
        if command -v "$candidate" >/dev/null 2>&1; then
            CHROME=$(command -v "$candidate")
            break
        fi
    done
fi
if [ -z "$CHROME" ]; then
    printf '%s\n' "No Chromium found. Set CHROME=/path/to/chrome." >&2
    exit 1
fi

render() {
    html=$1
    size=$2
    out="$(pwd)/../../public/$3"
    tmp="$out.tmp.png"
    rm -f "$tmp"
    if ! "$CHROME" --headless=new --disable-gpu --hide-scrollbars --no-sandbox \
        --window-size="$size" --force-device-scale-factor=2 \
        --virtual-time-budget=8000 --run-all-compositor-stages-before-draw \
        --screenshot="$tmp" "file://$(pwd)/$html" >/dev/null 2>&1 || [ ! -f "$tmp" ]; then
        rm -f "$tmp"
        printf '%s\n' "render failed: $html" >&2
        exit 1
    fi
    mv "$tmp" "$out"
    printf '%s\n' "wrote public/$3"
}

render infra.html 1600,1300 infra-stack.png
render serverless-flow.html 900,900 aws-serverless-flow.png
render three-tier-legacy.html 720,620 aws-three-tier-legacy.png
render cost-comparison.html 900,430 aws-cost-comparison.png
render sre-sweep.html 840,650 sre-sweep-flow.png
render sre-stack.html 840,880 sre-sweep-stack.png
render sre-pool.html 900,380 sre-pool-tradeoff.png
render sre-boundary.html 900,384 sre-boundary-ladder.png
render cloud-automation.html 900,890 cloud-automation-stack.png
render digging-the-wire.html 900,560 digging-the-wire.png
render payment-rail.html 800,720 shipping-payment-rail.png
render deploy-pipeline.html 900,580 shipping-deploy-pipeline.png
render log-pipeline.html 760,710 shipping-log-pipeline.png
render voice-path.html 900,760 shipping-voice-path.png
render aws-single-az.html 840,600 aws-single-az.png
render sre-then-now.html 840,400 sre-then-now.png
render sre-spec-paths.html 840,520 sre-spec-paths.png
render shipping-floor.html 840,428 shipping-floor.png
render shipping-runner-order.html 840,470 shipping-runner-order.png
render shipping-rail-path.html 840,480 shipping-rail-path.png
render shipping-deleted.html 840,256 shipping-deleted.png
