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

render serverless-flow.html 900,780 aws-serverless-flow.png
render three-tier-legacy.html 720,620 aws-three-tier-legacy.png
render cost-comparison.html 900,430 aws-cost-comparison.png
render sre-sweep.html 840,650 sre-sweep-flow.png
render cloud-automation.html 900,890 cloud-automation-stack.png
render digging-the-wire.html 900,560 digging-the-wire.png
render payment-rail.html 800,720 shipping-payment-rail.png
render deploy-pipeline.html 900,460 shipping-deploy-pipeline.png
render log-pipeline.html 760,720 shipping-log-pipeline.png
render voice-path.html 900,760 shipping-voice-path.png
