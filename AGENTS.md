# AGENTS.md

VS Code subtitle extension. TypeScript extension code in `src/` (bundled), plus
TextMate grammars in `syntaxes/` for ASS/SSA, SRT, LRC, WebVTT and MicroDVD/SubViewer.

## Commands

```bash
npm install
npm run build         # esbuild -> dist/extension.js (required after src/ changes)
npm run watch         # rebuild on change
npm run typecheck     # tsc --noEmit
npm run test:grammar  # tokenize fixtures with vscode-textmate/oniguruma
npm run package       # vsce package (may fail if vsce not global)
npx --yes @vscode/vsce package --no-dependencies --out ass-subtitles-0.1.0.vsix  # verified packaging
```

Order that matters: `typecheck` + `build` + `test:grammar` before packaging.

## Architecture facts

- `syntaxes/*.tmLanguage.json` are referenced directly by `package.json`, so grammar
  edits take effect **without** a build. Only `src/` needs `npm run build`.
- `src/extension.ts` registers providers: `AssColorProvider` (swatch),
  `AssColorFieldHighlighter` (purple `Hxxx`), `AssFoldingProvider`. All are ASS-only;
  SRT/LRC/VTT/SUB get syntax highlighting only.
- Custom foreground colors cannot be forced via TextMate scopes, so
  `src/colorFieldHighlighter.ts` uses `TextEditorDecorationType` instead.
- Debug with F5 (`.vscode/launch.json`, preLaunchTask `npm: build`), then open `samples/`.

## Adding a language/grammar

Update all of: `package.json` (`contributes.languages`, `contributes.grammars`,
`activationEvents`) **and** `scripts/test-grammar.js` (grammars map + expectations).
Reuse `language-configuration/subtitle.language-configuration.json` for non-ASS formats.

## TextMate grammar gotchas (already caused bugs)

- Oniguruma alternation is **first-match, not longest-match**. List longer tags first
  (e.g. `bord` before `b`, `fscx` before `fs`) and add `(?![a-zA-Z])`.
- `captures` values only accept `name`; nested `patterns` are invalid. Use `begin`/`end`
  for recursive/nested content.
- SRT/VTT text rules must use a **zero-width** `begin` (`^[ \t]*(?=\S)`) so nested tag
  patterns run; a `begin` that consumes the line blocks them.
- Test assertions accept `[line, scope, expectedText?]`; the optional third element
  catches prefix mis-splitting (e.g. `bord` vs `b`+`ord`).

## ASS specifics

- Color literals are `&HAABBGGRR` (BGR order, and alpha is inverted: `00` = opaque,
  `FF` = transparent). Parsed in `src/colorProvider.ts`; 8-digit must match before
  6-digit (`{8}|{6}`) or `&H00FFFFFF` is misread.
- Only the `Hxxx` part of color values is decorated purple; keep `\`, `&`, and tag
  names in their normal theme colors.

## Packaging / repo notes

- `.vscodeignore` excludes `src/`, `scripts/`, `samples/`, maps — packaged VSIX ships
  only `dist/`, grammars, language configs, and docs.
- `publisher` is still the placeholder `local`; change before publishing.
- Git repo `main` branch, no commits yet.
