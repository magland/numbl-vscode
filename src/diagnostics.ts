import * as vscode from "vscode";

export interface StreamError {
  message: string;
  errorType?: string;
  file?: string;
  line?: number;
}

export function addDiagnostic(
  error: StreamError,
  document: vscode.TextDocument,
  collection: vscode.DiagnosticCollection
): void {
  const lineNum = Math.max(0, (error.line ?? 1) - 1); // 0-based

  // Determine the URI — error might be in a different file
  const uri = error.file ? vscode.Uri.file(error.file) : document.uri;

  // Build range — try to highlight the full line
  let range: vscode.Range;
  try {
    const doc =
      uri.fsPath === document.uri.fsPath
        ? document
        : undefined;
    if (doc && lineNum < doc.lineCount) {
      const lineText = doc.lineAt(lineNum).text;
      range = new vscode.Range(lineNum, 0, lineNum, lineText.length);
    } else {
      range = new vscode.Range(lineNum, 0, lineNum, 200);
    }
  } catch {
    range = new vscode.Range(lineNum, 0, lineNum, 200);
  }

  const severity =
    error.errorType === "warning"
      ? vscode.DiagnosticSeverity.Warning
      : vscode.DiagnosticSeverity.Error;

  const diag = new vscode.Diagnostic(range, error.message, severity);
  diag.source = "numbl";

  const existing = collection.get(uri) ?? [];
  collection.set(uri, [...existing, diag]);
}
