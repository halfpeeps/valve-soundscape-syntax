import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerDocumentSymbolProvider(
      { language: 'soundscape' }, 
      new BlockSymbolProvider()
    )
  );
}

class BlockSymbolProvider implements vscode.DocumentSymbolProvider {
  provideDocumentSymbols(
    document: vscode.TextDocument
  ): vscode.ProviderResult<vscode.DocumentSymbol[]> {
    const symbols: vscode.DocumentSymbol[] = [];
    const blockPattern = /^[a-zA-Z0-9_.]+(?=\s*\{)/gm; 
    let match;

    while ((match = blockPattern.exec(document.getText())) !== null) {
      const name = match[0];
      const startPos = document.positionAt(match.index);
      const blockStart = match.index;
      let blockEnd = document.getText().indexOf('}', blockStart);
      if (blockEnd === -1) continue; 

      const endPos = document.positionAt(blockEnd + 1);

      const range = new vscode.Range(startPos, endPos); 

      
      const symbol = new vscode.DocumentSymbol(
        name,
        'Block',
        vscode.SymbolKind.Module,
        range,
        range
      );

      symbols.push(symbol);
    }

    return symbols;
  }
}