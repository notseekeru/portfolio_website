#!/bin/sh
# Token single-source guard (POSIX sh — runs in the alpine/node dev container).
# Fails if a raw 6-digit hex color sneaks into src/ outside the two sanctioned
# definitions: the `@theme` block in src/index.css and `MERMAID_THEME` in
# src/utils/InteractiveMermaid.tsx.
#
# Prevents the "white background" class of bug: a color changed in one place
# but not another, or a var(--color-*) that silently points at a dropped token.

set -u
SRC="${1:-src}"
status=0

GLOBAL_ALLOW='#0d0d0d|#000000|#ffffff'

# find all css/ts/tsx under SRC, excluding type declarations
files=$(find "$SRC" -type f \( -name '*.tsx' -o -name '*.ts' -o -name '*.css' \) ! -name '*.d.ts')

for file in $files; do
    case "$file" in
    *src/utils/InteractiveMermaid.tsx)
        # Only the MERMAID_THEME const block may hold raw hex.
        in_block=0
        while IFS= read -r line; do
            case "$line" in
                *"const MERMAID_THEME ="*) in_block=1 ;;
                *"};"*) [ "$in_block" -eq 1 ] && in_block=0 ;;
            esac
            [ "$in_block" -eq 1 ] && continue
            bad=$(printf '%s\n' "$line" | grep -oE '#[0-9a-fA-F]{6}' | grep -viE "$GLOBAL_ALLOW" || true)
            if [ -n "$bad" ]; then
                printf 'VIOLATION: %s: raw hex outside MERMAID_THEME: %s\n' "$file" "$bad"
                status=1
            fi
        done < "$file"
        ;;
    *src/index.css)
        # Only within @theme may raw hex appear.
        in_theme=0
        while IFS= read -r line; do
            case "$line" in
                *"@theme"*) in_theme=1 ;;
                *"}"*) [ "$in_theme" -eq 1 ] && in_theme=0 ;;
            esac
            [ "$in_theme" -eq 1 ] && continue
            bad=$(printf '%s\n' "$line" | grep -oE '#[0-9a-fA-F]{6}' || true)
            if [ -n "$bad" ]; then
                printf 'VIOLATION: %s: raw hex outside @theme: %s\n' "$file" "$bad"
                status=1
            fi
        done < "$file"
        ;;
    *)
        # All other src files: any raw hex is a violation (except global-safe).
        bad=$(grep -oE '#[0-9a-fA-F]{6}' "$file" | grep -viE "$GLOBAL_ALLOW" || true)
        if [ -n "$bad" ]; then
            printf 'VIOLATION: %s: raw hex (use a token instead): %s\n' "$file" "$bad"
            status=1
        fi
        ;;
    esac
done

if [ "$status" -ne 0 ]; then
    printf '\nColor source-of-truth violated. All colors must be defined ONLY in\n'
    printf '  - src/index.css @theme\n'
    printf '  - src/utils/InteractiveMermaid.tsx MERMAID_THEME\n'
    printf 'and referenced via var(--color-*) or the theme constants elsewhere.\n'
    exit 1
fi

echo "OK: all colors sourced from @theme / MERMAID_THEME."
