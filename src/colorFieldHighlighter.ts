import * as vscode from 'vscode'

const COLOR_VALUE_RE = /(?<=&)H[0-9A-Fa-f]{1,8}/g

const DEFAULT_COLOR_FIELD = '#C586C0'

function config() {
    return vscode.workspace.getConfiguration('assSubtitles')
}

export class AssColorFieldHighlighter implements vscode.Disposable {
    private decoration: vscode.TextEditorDecorationType
    private readonly disposables: vscode.Disposable[] = []

    public constructor() {
        this.decoration = this.createDecoration()
        this.disposables.push(
            vscode.window.onDidChangeActiveTextEditor((editor) =>
                this.update(editor),
            ),
            vscode.window.onDidChangeVisibleTextEditors(() => this.updateAll()),
            vscode.workspace.onDidChangeTextDocument((event) => {
                const editor = vscode.window.visibleTextEditors.find(
                    (item) => item.document === event.document,
                )
                if (editor) {
                    this.update(editor)
                }
            }),
            vscode.workspace.onDidChangeConfiguration((event) => {
                if (!event.affectsConfiguration('assSubtitles.colorFieldHighlight')) {
                    return
                }
                this.decoration.dispose()
                this.decoration = this.createDecoration()
                this.updateAll()
            }),
        )
        this.updateAll()
    }

    public dispose(): void {
        this.decoration.dispose()
        for (const disposable of this.disposables) {
            disposable.dispose()
        }
    }

    private createDecoration(): vscode.TextEditorDecorationType {
        return vscode.window.createTextEditorDecorationType({
            color: config().get('colorFieldHighlight.color', DEFAULT_COLOR_FIELD),
            rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
        })
    }

    private updateAll(): void {
        for (const editor of vscode.window.visibleTextEditors) {
            this.update(editor)
        }
    }

    private update(editor: vscode.TextEditor | undefined): void {
        if (!editor) {
            return
        }
        const enabled = config().get('colorFieldHighlight.enabled', true)
        if (editor.document.languageId !== 'ass' || !enabled) {
            editor.setDecorations(this.decoration, [])
            return
        }

        const ranges: vscode.Range[] = []
        const document = editor.document
        for (let line = 0; line < document.lineCount; line++) {
            const text = document.lineAt(line).text
            COLOR_VALUE_RE.lastIndex = 0
            let match: RegExpExecArray | null
            while ((match = COLOR_VALUE_RE.exec(text)) !== null) {
                ranges.push(
                    new vscode.Range(
                        new vscode.Position(line, match.index),
                        new vscode.Position(line, match.index + match[0].length),
                    ),
                )
            }
        }
        editor.setDecorations(this.decoration, ranges)
    }
}
