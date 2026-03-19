import * as vscode from "vscode";
import { NumblRunner } from "./runner";
import { FigurePanel } from "./figurePanel";

let runner: NumblRunner | undefined;

export function activate(context: vscode.ExtensionContext) {
  const diagnosticCollection =
    vscode.languages.createDiagnosticCollection("numbl");
  const outputChannel = vscode.window.createOutputChannel("Numbl");
  const figurePanel = new FigurePanel(context.extensionUri);

  runner = new NumblRunner(outputChannel, diagnosticCollection, figurePanel);

  context.subscriptions.push(
    vscode.commands.registerCommand("numbl.run", () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor || !editor.document.fileName.endsWith(".m")) {
        vscode.window.showWarningMessage("Open a .m file to run with Numbl.");
        return;
      }
      // Save the document before running
      editor.document.save().then(() => {
        runner!.run(editor.document);
      });
    }),
    vscode.commands.registerCommand("numbl.stop", () => {
      runner?.stop();
    }),
    diagnosticCollection,
    outputChannel,
    figurePanel
  );
}

export function deactivate() {
  runner?.stop();
}
