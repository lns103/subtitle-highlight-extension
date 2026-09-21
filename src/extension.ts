import * as vscode from 'vscode'
import { AssColorProvider } from './colorProvider'
import { AssColorFieldHighlighter } from './colorFieldHighlighter'
import { AssFoldingProvider } from './foldingProvider'

export function activate(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
        vscode.languages.registerColorProvider(
            { language: 'ass' },
            new AssColorProvider(),
        ),
        vscode.languages.registerFoldingRangeProvider(
            { language: 'ass' },
            new AssFoldingProvider(),
        ),
        new AssColorFieldHighlighter(),
    )
}

export function deactivate(): void {
    return
}
