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

      let blockEnd = this.findMatchingBrace(document, blockStart);
      if (blockEnd === -1) continue;

      const endPos = document.positionAt(blockEnd);

      const range = new vscode.Range(startPos, endPos);

      //console.log(`Block found: ${name} at range: ${range}`);

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

  
  private findMatchingBrace(document: vscode.TextDocument, startPos: number): number {
    const text = document.getText();
    let balance = 0;
    let i = startPos;

   
    while (i < text.length) {
      const char = text[i];
      if (char === '{') {
        balance++;
      } else if (char === '}') {
        balance--;
        if (balance === 0) {
          return i; 
        }
      }
      i++;
    }

    return -1;
  }
}
