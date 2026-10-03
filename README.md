# ASS/SSA Subtitle Support

VSCode syntax highlighting and smart enhancements for **ASS/SSA**, **SRT**, **LRC**,
**WebVTT** and **MicroDVD/SubViewer** subtitle files, inspired by
[aster.vscode-subtitles](https://github.com/GalAster/vscode-subtitles).

## Features

### ASS / SSA
- Section highlighting: `[Script Info]`, `[V4+ Styles]`, `[Events]`, `[Fonts]`, `[Graphics]`.
- Event lines: `Dialogue:`, `Comment:`, `Style:`, `Format:`, `Picture:` and friends.
- Full override-tag support: `\b \i \u \s \c \1c..\4c \alpha \fn \fs \fscx \fscy
  \frz \frx \fry \bord \shad \blur \be \pos \move \org \fad \fade \t \clip \iclip
  \k \K \kf \ko \q \r \p`.
- Time stamps, ASS colors (`&HAABBGGRR&` / `&HBBGGRR&`) and escapes (`\N \n \h`).
- **Color swatches** for every ASS color value.
- **Section folding**.

### SRT / LRC / WebVTT / SUB
- SubRip index, time codes (with optional coordinates) and HTML/`{}` styling tags.
- LRC timestamps (`[mm:ss.xx]`) and metadata tags (`[ar:...]`, `[ti:...]`).
- WebVTT header/metadata, `NOTE` comments, cue identifiers, time codes, cue settings
  (`align:`, `position:`, ...), inline tags (`<b>`, `<c.class>`, `<v Name>`) and entities.
- MicroDVD frame cues (`{start}{end}text`, `{y:i}` styles, `|` breaks) and SubViewer
  timestamp cues plus `[metadata]` header.

Supported extensions: `.ass`, `.ssa`, `.srt`, `.lrc`, `.vtt`, `.sub`.

## Settings

| Setting | Default | Description |
| --- | --- | --- |
| `assSubtitles.colorDecorators.enabled` | `true` | Show color swatches for ASS colors. |
| `assSubtitles.folding.enabled` | `true` | Enable folding of ASS/SSA sections. |

The `Hxxx` part of ASS color values is scoped `keyword.control.ass`, so it follows the
theme's control-keyword color (same as TypeScript `import`/`return`). No custom color
setting is needed.

## Development

```bash
npm install
npm run build      # bundle with esbuild
npm run watch      # rebuild on change
npm run typecheck  # tsc --noEmit
```

Press <kbd>F5</kbd> to launch an Extension Development Host, then open a file under
`samples/`.

## Packaging

```bash
npm run package    # produces a .vsix
```
