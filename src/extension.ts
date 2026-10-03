import * as vscode from 'vscode'
import { AssColorProvider } from './colorProvider'
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
    )
}

export function deactivate(): void {
    return
}
