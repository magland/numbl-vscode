import * as vscode from "vscode";
import { spawn, type ChildProcess } from "child_process";
import * as readline from "readline";
import { addDiagnostic } from "./diagnostics";
import type { FigurePanel } from "./figurePanel";
import * as path from "path";

interface StreamMessage {
  type: "output" | "drawnow" | "error" | "done";
  text?: string;
  plotInstructions?: unknown[];
  message?: string;
  errorType?: string;
  file?: string;
  line?: number;
  snippet?: string;
}

export class NumblRunner {
  private child: ChildProcess | undefined;

  constructor(
    private outputChannel: vscode.OutputChannel,
    private diagnostics: vscode.DiagnosticCollection,
    private figurePanel: FigurePanel
  ) {}

  run(document: vscode.TextDocument): void {
    // Kill any previous run
    this.stop();

    this.diagnostics.clear();
    this.outputChannel.clear();
    this.outputChannel.show(true); // preserveFocus

    vscode.commands.executeCommand("setContext", "numbl.running", true);

    const config = vscode.workspace.getConfiguration("numbl");
    const command = config.get<string>("command", "npx numbl");
    const extraPaths = config.get<string[]>("extraPaths", []);

    const filePath = document.uri.fsPath;
    const cwd = path.dirname(filePath);

    // Split the command prefix into executable + its args, then append run args
    const parts = command.trim().split(/\s+/);
    const executable = parts[0];
    const args = [
      ...parts.slice(1),
      "run",
      filePath,
      "--stream",
      "--add-script-path",
    ];
    for (const p of extraPaths) {
      args.push("--path", p);
    }

    this.outputChannel.appendLine(`> ${executable} ${args.join(" ")}\n`);

    try {
      this.child = spawn(executable, args, { cwd, shell: true });
    } catch (err) {
      this.outputChannel.appendLine(
        `Failed to start numbl: ${err instanceof Error ? err.message : err}`
      );
      vscode.commands.executeCommand("setContext", "numbl.running", false);
      return;
    }

    const rl = readline.createInterface({ input: this.child.stdout! });

    rl.on("line", (line: string) => {
      let msg: StreamMessage;
      try {
        msg = JSON.parse(line);
      } catch {
        this.outputChannel.appendLine(line);
        return;
      }

      switch (msg.type) {
        case "output":
          this.outputChannel.append(msg.text ?? "");
          break;

        case "drawnow":
          if (msg.plotInstructions && msg.plotInstructions.length > 0) {
            this.figurePanel.sendPlotInstructions(msg.plotInstructions);
          }
          break;

        case "error":
          this.outputChannel.appendLine(
            `Error${msg.file ? ` in ${msg.file}` : ""}${msg.line ? `:${msg.line}` : ""}: ${msg.message}`
          );
          if (msg.snippet) {
            this.outputChannel.appendLine(msg.snippet);
          }
          addDiagnostic(
            {
              message: msg.message ?? "Unknown error",
              errorType: msg.errorType,
              file: msg.file,
              line: msg.line,
            },
            document,
            this.diagnostics
          );
          break;

        case "done":
          this.outputChannel.appendLine("\n--- Script complete ---");
          break;
      }
    });

    this.child.stderr?.on("data", (data: Buffer) => {
      this.outputChannel.append(data.toString());
    });

    this.child.on("close", (code: number | null) => {
      this.child = undefined;
      vscode.commands.executeCommand("setContext", "numbl.running", false);
      if (code !== null && code !== 0) {
        this.outputChannel.appendLine(`\nProcess exited with code ${code}`);
      }
    });

    this.child.on("error", (err: Error) => {
      this.child = undefined;
      vscode.commands.executeCommand("setContext", "numbl.running", false);
      this.outputChannel.appendLine(`Failed to run numbl: ${err.message}`);
      vscode.window.showErrorMessage(
        `Could not start numbl. Is it installed? Check the numbl.cliPath setting.\n${err.message}`
      );
    });
  }

  stop(): void {
    if (this.child) {
      this.child.kill();
      this.child = undefined;
      vscode.commands.executeCommand("setContext", "numbl.running", false);
    }
  }
}
