import * as vscode from 'vscode'

const COLOR_RE = /&H([0-9A-Fa-f]{8}|[0-9A-Fa-f]{6})/g

function isEnabled(key: string): boolean {
    return vscode.workspace.getConfiguration('assSubtitles').get(key, true)
}

function byte(value: number): string {
    return Math.round(value * 255)
        .toString(16)
        .padStart(2, '0')
        .toUpperCase()
}

function parseAssColor(hex: string): vscode.Color {
    const hasAlpha = hex.length === 8
    const alpha = hasAlpha ? 1 - parseInt(hex.slice(0, 2), 16) / 255 : 1
    const bgr = hex.slice(-6)
    const b = parseInt(bgr.slice(0, 2), 16) / 255
    const g = parseInt(bgr.slice(2, 4), 16) / 255
    const r = parseInt(bgr.slice(4, 6), 16) / 255
    return new vscode.Color(r, g, b, alpha)
}

function formatAssColor(color: vscode.Color, withAlpha: boolean): string {
    const bgr = `${byte(color.blue)}${byte(color.green)}${byte(color.red)}`
    return withAlpha ? `${byte(1 - color.alpha)}${bgr}` : bgr
}

export class AssColorProvider implements vscode.DocumentColorProvider {
    public provideDocumentColors(
        document: vscode.TextDocument,
    ): vscode.ColorInformation[] {
        if (!isEnabled('colorDecorators.enabled')) {
            return []
        }
        const result: vscode.ColorInformation[] = []
        for (let i = 0; i < document.lineCount; i++) {
            const text = document.lineAt(i).text
            COLOR_RE.lastIndex = 0
            let match: RegExpExecArray | null
            while ((match = COLOR_RE.exec(text)) !== null) {
                const hex = match[1]
                const start = match.index + match[0].length - hex.length
                const range = new vscode.Range(
                    new vscode.Position(i, start),
                    new vscode.Position(i, start + hex.length),
                )
                result.push(
                    new vscode.ColorInformation(range, parseAssColor(hex)),
                )
            }
        }
        return result
    }

    public provideColorPresentations(
        color: vscode.Color,
        context: { document: vscode.TextDocument; range: vscode.Range },
    ): vscode.ColorPresentation[] {
        const original = context.document.getText(context.range)
        const withAlpha = original.length === 8
        const text = formatAssColor(color, withAlpha)
        const presentation = new vscode.ColorPresentation(text)
        presentation.textEdit = new vscode.TextEdit(context.range, text)
        return [presentation]
    }
}
