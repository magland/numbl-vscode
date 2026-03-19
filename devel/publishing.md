# Publishing a new version

## One-time setup

Log in to the `jmagland` publisher (requires a [Personal Access Token](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#get-a-personal-access-token)):

```bash
npx @vscode/vsce login jmagland
```

## Steps

1. Bump the `version` in `package.json` (e.g., `0.0.1` → `0.0.2`).

2. Build and package:

   ```bash
   npm run build
   npx @vscode/vsce package
   ```

   This produces a `.vsix` file in the project root.

3. Publish to the VS Code Marketplace:

   ```bash
   npx @vscode/vsce publish
   ```

## Testing locally before publishing

Install the packaged extension without publishing:

```bash
code --install-extension numbl-0.0.2.vsix
```
