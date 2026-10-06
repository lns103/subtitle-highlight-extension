const fs = require('fs')
const path = require('path')
const vsctm = require('vscode-textmate')
const oniguruma = require('vscode-oniguruma')

const root = path.resolve(__dirname, '..')
const wasmPath = path.join(root, 'node_modules', 'vscode-oniguruma', 'release', 'onig.wasm')

const grammars = {
    'source.ass': JSON.parse(fs.readFileSync(path.join(root, 'syntaxes', 'ass.tmLanguage.json'), 'utf8')),
    'source.subrip': JSON.parse(fs.readFileSync(path.join(root, 'syntaxes', 'srt.tmLanguage.json'), 'utf8')),
    'source.lyric': JSON.parse(fs.readFileSync(path.join(root, 'syntaxes', 'lrc.tmLanguage.json'), 'utf8')),
    'source.webvtt': JSON.parse(fs.readFileSync(path.join(root, 'syntaxes', 'vtt.tmLanguage.json'), 'utf8')),
    'source.microdvd': JSON.parse(fs.readFileSync(path.join(root, 'syntaxes', 'sub.tmLanguage.json'), 'utf8')),
}

const onigLib = Promise.resolve().then(async () => {
    const wasm = fs.readFileSync(wasmPath)
    await oniguruma.loadWASM(wasm.buffer.slice(wasm.byteOffset, wasm.byteOffset + wasm.byteLength))
    return {
        createOnigScanner: (patterns) => new oniguruma.OnigScanner(patterns),
        createOnigString: (s) => new oniguruma.OnigString(s),
    }
})

const registry = new vsctm.Registry({
    onigLib,
    loadGrammar: async (scopeName) => grammars[scopeName] || null,
})

const expectations = {
    'source.ass': [
        ['[Script Info]', 'entity.name.section.ass'],
        ['Title: My Script', 'entity.name.tag.ass'],
        ['; a comment', 'comment.line.semicolon.ass'],
        ['Style: Default,Arial,48,&H00FFFFFF,&H000000FF,&H00000000,&H64000000,0,0,0,0,100,100,0,0,1,2,1,2,10,10,10,1', 'entity.name.tag.event.ass'],
        ['Dialogue: 0,0:00:01.00,0:00:04.00,Default,,0,0,0,,{\\fad(500,500)\\pos(960,900)}Hello', 'support.function.tag.ass'],
        ['Dialogue: 0,0:00:01.00,0:00:04.00,Default,,0,0,0,,{\\c&H00FFFF&}world', 'keyword.control.ass', 'H00FFFF'],
        ['Dialogue: 0,0:00:01.00,0:00:04.00,Default,,0,0,0,,{\\c&H00FFFF&}world', 'keyword.control.ass', '&'],
        ['Dialogue: 0,0:00:01.00,0:00:04.00,Default,,0,0,0,,line\\Nbreak', 'constant.character.escape.ass'],
        ['Dialogue: 0,0:00:01.00,0:00:04.00,Default,,0,0,0,,{\\t(0,500,\\fscx120\\fscy120)}zoom', 'support.function.transform.ass'],
        ['Dialogue: 0,0:00:01.00,0:00:04.00,Default,,0,0,0,,{\\k50}ka{\\k30}ra', 'support.function.tag.ass'],
        ['Format: Layer, Start, End, Style', 'variable.parameter.field.ass'],
        ['Dialogue: 0,0:00:01.00,0:00:04.00,Default,,0,0,0,,{\\bord2\\shad0\\fscx150\\fscy160\\alpha&H56&\\c&H000000&\\3c&HECB000&}x', 'support.function.tag.ass', 'bord'],
        ['Dialogue: 0,0:00:01.00,0:00:04.00,Default,,0,0,0,,{\\bord2\\shad0\\fscx150\\fscy160\\alpha&H56&\\c&H000000&\\3c&HECB000&}x', 'support.function.tag.ass', 'shad'],
        ['Dialogue: 0,0:00:01.00,0:00:04.00,Default,,0,0,0,,{\\bord2\\shad0\\fscx150\\fscy160\\alpha&H56&\\c&H000000&\\3c&HECB000&}x', 'support.function.tag.ass', 'fscx'],
        ['Dialogue: 0,0:00:01.00,0:00:04.00,Default,,0,0,0,,{\\bord2\\shad0\\fscx150\\fscy160\\alpha&H56&\\c&H000000&\\3c&HECB000&}x', 'support.function.tag.ass', 'fscy'],
        ['Dialogue: 0,0:00:01.00,0:00:04.00,Default,,0,0,0,,{\\bord2\\shad0\\fscx150\\fscy160\\alpha&H56&\\c&H000000&\\3c&HECB000&}x', 'support.function.tag.ass', 'alpha'],
        ['Dialogue: 0,0:00:01.00,0:00:04.00,Default,,0,0,0,,{\\bord2\\shad0\\fscx150\\fscy160\\alpha&H56&\\c&H000000&\\3c&HECB000&}x', 'keyword.control.ass', 'H56'],
        ['Dialogue: 0,0:00:01.00,0:00:04.00,Default,,0,0,0,,{\\bord2\\shad0\\fscx150\\fscy160\\alpha&H56&\\c&H000000&\\3c&HECB000&}x', 'support.function.tag.ass', '3c'],
        ['Dialogue: 0,0:00:01.00,0:00:04.00,Default,,0,0,0,,{\\bord2\\shad0\\fscx150\\fscy160\\alpha&H56&\\c&H000000&\\3c&HECB000&}x', 'constant.numeric.tag.ass', '2'],
        ['Dialogue: 0,0:00:01.00,0:00:04.00,Default,,0,0,0,,{\\alpha&566\\c&000000&}x', 'keyword.control.ass', '566'],
        ['Dialogue: 0,0:00:01.00,0:00:04.00,Default,,0,0,0,,{\\alpha&566\\c&000000&}x', 'keyword.control.ass', '000000'],
        ['Dialogue: 0,0:00:01.00,0:00:04.00,Default,,0,0,0,,{\\fnArial Narrow\\b1}x', 'variable.parameter.style.ass', 'Arial Narrow'],
        ['Dialogue: 0,0:00:01.00,0:00:04.00,Default,,0,0,0,,{\\fn微软雅黑}x', 'variable.parameter.style.ass', '微软雅黑'],
        ['Style: Default,Arial,48,&H00FFFFFF,&H64000000,0', 'keyword.control.ass', 'H00FFFFFF'],
        ['Style: Translate, 黑体, 60, &H00EEEEEE, &HF0000000, &H00000000, &H32000000, 0, 0, 0, 0, 100, 100, 0, 0, 1, 1.5, 0, 2, 18, 18, 18, 1', 'keyword.control.ass', 'H00EEEEEE'],
        ['Style: Translate, 黑体, 60, &H00EEEEEE, &HF0000000, &H00000000, &H32000000, 0, 0, 0, 0, 100, 100, 0, 0, 1, 1.5, 0, 2, 18, 18, 18, 1', 'constant.numeric.ass', '60'],
    ],
    'source.subrip': [
        ['1', 'constant.numeric.index.subrip'],
        ['00:00:01,000 --> 00:00:04,000', 'constant.other.timestamp.subrip'],
        ['00:00:01,000 --> 00:00:04,000', 'constant.other.timestamp.subrip', '-->'],
        ['Hello <b>world</b>!', 'entity.name.tag.subrip'],
        ['{\\an8}Top aligned line', 'constant.other.ass-tag.subrip'],
    ],
    'source.lyric': [
        ['[00:01.00]First line', 'constant.other.timestamp.lyric'],
        ['[ar:Artist]', 'entity.name.tag.meta.lyric'],
        ['Just a plain line', 'string.literal.lyric'],
    ],
    'source.webvtt': [
        ['WEBVTT', 'keyword.control.header.webvtt'],
        ['Kind: captions', 'entity.name.tag.metadata.webvtt'],
        ['NOTE this is a comment', 'comment.block.webvtt'],
        ['1', 'constant.numeric.index.webvtt'],
        ['00:00:01.000 --> 00:00:04.000 align:start position:10%', 'constant.other.timestamp.webvtt'],
        ['00:00:01.000 --> 00:00:04.000 align:start position:10%', 'entity.other.attribute-name.cue-setting.webvtt'],
        ['Hello <b>world</b> and <c.yellow>color</c>', 'entity.name.tag.webvtt'],
        ['Fish &amp; Chips', 'constant.character.entity.webvtt'],
    ],
    'source.microdvd': [
        ['{1234}{5678}Hello {y:i}world', 'constant.numeric.frame.microdvd'],
        ['{1234}{5678}Hello {y:i}world', 'support.function.style.microdvd'],
        ['{1234}{5678}line one|line two', 'constant.character.escape.microdvd'],
        ['[INFORMATION]', 'entity.name.tag.metadata.microdvd'],
        ['00:00:01.00,00:00:04.00', 'constant.other.timestamp.subviewer'],
        ['A plain SubViewer line', 'string.literal.subviewer'],
    ],
}

async function main() {
    let failures = 0
    for (const [scopeName, cases] of Object.entries(expectations)) {
        const grammarInstance = await registry.loadGrammar(scopeName)
        console.log(`\n# ${scopeName}`)
        for (const [line, expectedScope, expectedText] of cases) {
            const { tokens } = grammarInstance.tokenizeLine(line, vsctm.INITIAL)
            const scopes = tokens.map((t) => t.scopes[t.scopes.length - 1])
            const ok = expectedText
                ? tokens.some(
                      (t) =>
                          t.scopes[t.scopes.length - 1].includes(expectedScope) &&
                          line.slice(t.startIndex, t.endIndex) === expectedText,
                  )
                : scopes.some((s) => s && s.includes(expectedScope))
            const label = expectedText
                ? `${expectedScope} = "${expectedText}"`
                : expectedScope
            if (ok) {
                console.log(`PASS  ${label.padEnd(40)}  ${line.slice(0, 40)}`)
            } else {
                failures++
                console.log(`FAIL  ${label.padEnd(40)}  ${line.slice(0, 40)}`)
                console.log(`      got: ${[...new Set(scopes)].join(', ')}`)
            }
        }
    }
    if (failures > 0) {
        console.error(`\n${failures} grammar assertion(s) failed.`)
        process.exit(1)
    }
    console.log('\nAll grammar assertions passed.')
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
