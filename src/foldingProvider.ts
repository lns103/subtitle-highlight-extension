import * as vscode from 'vscode'

const SECTION_RE = /^\s*\[[^\]\r\n]+\]/

export class AssFoldingProvider implements vscode.FoldingRangeProvider {
    public provideFoldingRanges(
        document: vscode.TextDocument,
    ): vscode.FoldingRange[] {
        if (!vscode.workspace.getConfiguration('assSubtitles').get('folding.enabled', true)) {
            return []
        }
        const starts: number[] = []
        for (let i = 0; i < document.lineCount; i++) {
            if (SECTION_RE.test(document.lineAt(i).text)) {
                starts.push(i)
            }
        }

        const ranges: vscode.FoldingRange[] = []
        for (let i = 0; i < starts.length; i++) {
            const start = starts[i]
            const end =
                i + 1 < starts.length ? starts[i + 1] - 1 : document.lineCount - 1
            if (end > start) {
                ranges.push(
                    new vscode.FoldingRange(
                        start,
                        end,
                        vscode.FoldingRangeKind.Region,
                    ),
                )
            }
        }
        return ranges
    }
}
