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
    "$CHROME" --headless=new --disable-gpu --hide-scrollbars --no-sandbox \
        --window-size="$size" --force-device-scale-factor=2 \
        --virtual-time-budget=8000 --run-all-compositor-stages-before-draw \
        --screenshot="$out" "file://$(pwd)/$html" >/dev/null 2>&1
    test -f "$out" || {
        printf '%s\n' "render failed: $html" >&2
        exit 1
    }
    printf '%s\n' "wrote public/$3"
}

render serverless-flow.html 900,780 aws-serverless-flow.png
render three-tier-legacy.html 720,620 aws-three-tier-legacy.png
render cost-comparison.html 900,430 aws-cost-comparison.png
