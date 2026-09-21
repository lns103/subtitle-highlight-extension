# Change Log

## 0.1.0

- Initial release.
- ASS/SSA syntax highlighting with full override-tag coverage.
- Longest-first tag matching so `\bord`, `\shad`, `\fscx`/`\fscy`, `\blur` are no longer split into shorter tags.
- Relaxed color values: `\alpha&566`, `\c&HFF0000`, `\c&HFF0000&` all highlight.
- Dedicated `variable.parameter.font.ass` scope for `\fn` font names.
- Fixed color swatches: 8-digit colors were read as 6-digit (`&H00FFFFFF` showed as yellow, `&HF0000000` as blue).
- Fixed ASS alpha interpretation (`00` is opaque, `FF` is transparent).
- Purple highlight now applies only to the `Hxxx` part of color values; color tags (`c`, `3c`, `alpha`, ...) use the normal tag color.
- `\fn` font names now use the same pale-blue color as `\r` style names.
- ASS color swatches via `DocumentColorProvider`.
- ASS section folding via `FoldingRangeProvider`.
- SRT and LRC syntax highlighting.
- WebVTT (`.vtt`) syntax highlighting.
- MicroDVD / SubViewer (`.sub`) syntax highlighting.
