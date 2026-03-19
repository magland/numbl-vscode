# Numbl for VS Code

Run `.m` scripts directly in VS Code using [numbl](https://github.com/flatironinstitute/numbl).

## Features

- **Run button** in the editor title bar for `.m` files
- **Text output** displayed in the Numbl output channel
- **Figures and plots** rendered in a webview panel (2D plots, 3D surfaces, imagesc, contour, etc.)
- **Error diagnostics** shown as inline squiggles with file and line info
- **Keyboard shortcut**: `Ctrl+Shift+R` to run the current script

## Requirements

[numbl](https://github.com/flatironinstitute/numbl) must be installed and available on your PATH:

```bash
npm install -g numbl
```

For optimal performance with linear algebra operations, build the native addon:

```bash
numbl build-addon
```

## Updating numbl

To upgrade to the latest version of numbl:

```bash
npm install -g numbl@latest
```

The extension will notify you when a newer version is available on npm.

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `numbl.command` | `"numbl"` | Command prefix for running numbl. Examples: `"numbl"`, `"npx numbl"`, `"npx tsx /path/to/src/cli.ts"` |
| `numbl.addScriptPath` | `true` | Add the script's directory to the numbl workspace |
| `numbl.extraPaths` | `[]` | Additional workspace directories passed to numbl via `--path` |

## Usage

1. Open a `.m` file
2. Click the play button in the editor title bar (or press `Ctrl+Shift+R`)
3. Output appears in the "Numbl" output channel
4. Figures appear in a side panel

## Reporting issues

- **Numbl bugs** (wrong results, missing functions, crashes): [flatironinstitute/numbl](https://github.com/flatironinstitute/numbl/issues)
- **Extension bugs** (UI glitches, figures not rendering, etc.): [magland/numbl-vscode](https://github.com/magland/numbl-vscode/issues)
