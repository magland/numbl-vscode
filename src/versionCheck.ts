import * as vscode from "vscode";
import { execFile } from "child_process";

/** Check npm registry for a newer numbl version and show a subtle notification. */
export function checkForNumblUpdate(): void {
  const config = vscode.workspace.getConfiguration("numbl");
  const command = config.get<string>("command", "numbl");

  // Get the installed version via `numbl info`
  const executable = command.split(/\s+/)[0];
  const baseArgs = command.split(/\s+/).slice(1);

  execFile(
    executable,
    [...baseArgs, "info"],
    { timeout: 10_000, shell: true },
    (err, stdout) => {
      if (err) return;
      try {
        const info = JSON.parse(stdout.trim());
        const installedVersion = info.version;
        if (!installedVersion) return;
        fetchLatestVersion(installedVersion);
      } catch {
        // not valid JSON — ignore
      }
    }
  );
}

function fetchLatestVersion(installedVersion: string): void {
  execFile(
    "npm",
    ["view", "numbl", "version"],
    { timeout: 15_000, shell: true },
    (err, stdout) => {
      if (err) return;
      const latestVersion = stdout.trim();
      if (!latestVersion) return;
      if (isNewer(latestVersion, installedVersion)) {
        showUpdateNotification(installedVersion, latestVersion);
      }
    }
  );
}

function isNewer(latest: string, installed: string): boolean {
  const parse = (v: string) => v.replace(/^v/, "").split(".").map(Number);
  const [lMaj, lMin, lPatch] = parse(latest);
  const [iMaj, iMin, iPatch] = parse(installed);
  if (lMaj !== iMaj) return lMaj > iMaj;
  if (lMin !== iMin) return lMin > iMin;
  return lPatch > iPatch;
}

function showUpdateNotification(
  installed: string,
  latest: string
): void {
  const message = `Numbl ${latest} is available (you have ${installed}).`;
  vscode.window
    .showInformationMessage(message, "Update now", "Dismiss")
    .then((choice) => {
      if (choice === "Update now") {
        const terminal = vscode.window.createTerminal("Numbl Update");
        terminal.show();
        terminal.sendText("npm install -g numbl@latest");
      }
    });
}
