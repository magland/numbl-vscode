import * as vscode from "vscode";

export class FigurePanel implements vscode.Disposable {
  private panel: vscode.WebviewPanel | undefined;
  private ready = false;
  private pendingMessages: unknown[] = [];

  constructor(private extensionUri: vscode.Uri) {}

  sendPlotInstructions(plotInstructions: unknown[]): void {
    this.ensurePanel();
    const msg = { type: "drawnow", plotInstructions };
    if (this.ready) {
      this.panel!.webview.postMessage(msg);
    } else {
      this.pendingMessages.push(msg);
    }
    // Reveal if not visible, but don't steal focus
    this.panel!.reveal(vscode.ViewColumn.Beside, true);
  }

  clear(): void {
    if (this.panel) {
      const msg = { type: "clear" };
      if (this.ready) {
        this.panel.webview.postMessage(msg);
      } else {
        this.pendingMessages.push(msg);
      }
    }
  }

  dispose(): void {
    this.panel?.dispose();
    this.panel = undefined;
    this.ready = false;
    this.pendingMessages = [];
  }

  private ensurePanel(): void {
    if (this.panel) return;

    this.ready = false;
    this.pendingMessages = [];

    this.panel = vscode.window.createWebviewPanel(
      "numbl.figures",
      "Numbl Figures",
      { viewColumn: vscode.ViewColumn.Beside, preserveFocus: true },
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.joinPath(this.extensionUri, "dist-webview"),
        ],
      }
    );

    this.panel.webview.html = this.getHtml(this.panel.webview);

    // Listen for "ready" signal from the webview
    this.panel.webview.onDidReceiveMessage((msg: { type: string }) => {
      if (msg.type === "ready") {
        this.ready = true;
        for (const pending of this.pendingMessages) {
          this.panel!.webview.postMessage(pending);
        }
        this.pendingMessages = [];
      }
    });

    this.panel.onDidDispose(() => {
      this.panel = undefined;
      this.ready = false;
      this.pendingMessages = [];
    });
  }

  private getHtml(webview: vscode.Webview): string {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "dist-webview", "main.js")
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "dist-webview", "style.css")
    );

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'none';
             script-src ${webview.cspSource} 'unsafe-eval';
             style-src ${webview.cspSource} 'unsafe-inline';
             img-src ${webview.cspSource} data: blob:;">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="${styleUri}">
</head>
<body style="margin:0;overflow:hidden;background:#1e1e1e">
  <div id="root" style="width:100vw;height:100vh"></div>
  <script type="module" src="${scriptUri}"></script>
</body>
</html>`;
  }
}
