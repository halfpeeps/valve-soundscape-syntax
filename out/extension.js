"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
const vscode = __importStar(require("vscode"));
function activate(context) {
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider({ language: 'soundscape' }, // Ensure this matches your language ID
    new BlockSymbolProvider()));
}
class BlockSymbolProvider {
    provideDocumentSymbols(document) {
        const symbols = [];
        const blockPattern = /^[a-zA-Z0-9_.]+(?=\s*\{)/gm; // Regex for block names (like forest.suburbs_central)
        let match;
        // Loop through the document to find blocks
        while ((match = blockPattern.exec(document.getText())) !== null) {
            const name = match[0];
            const startPos = document.positionAt(match.index);
            const blockStart = match.index;
            let blockEnd = document.getText().indexOf('}', blockStart); // Find the closing brace for the block
            if (blockEnd === -1)
                continue; // skip if no closing brace found
            const endPos = document.positionAt(blockEnd + 1); // Adjust to include closing brace
            const range = new vscode.Range(startPos, endPos); // Use the range from the block name to the closing brace
            // Define the symbol with a larger range
            const symbol = new vscode.DocumentSymbol(name, 'Block', vscode.SymbolKind.Module, range, range);
            symbols.push(symbol);
        }
        return symbols;
    }
}
