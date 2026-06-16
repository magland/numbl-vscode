# Changelog

## 0.0.3

- Compatibility with current numbl: dropped the removed `--add-script-path`
  flag (numbl now adds the script's directory to the workspace automatically),
  so running scripts no longer fails with "Unknown option". Removed the now
  obsolete `numbl.addScriptPath` setting.
- Updated the figure renderer to match numbl's current graphics: many new plot
  types now render (pcolor, bar/bar3, area, errorbar, quiver/quiver3, pie, box,
  heatmap, patch, primitive line/surface, live `set` updates via handles),
  plus axis limits, log scales, `caxis`, colorbar location, custom colormaps,
  `cla`, and `uihtml` HTML components.
- Fixed the `devel/sync-graphics.sh` source path for the side-by-side repo
  layout.

## 0.0.2

- Notify when a newer version of numbl is available on npm
- `numbl.addScriptPath` setting (later removed in 0.0.3)
- Keywords, changelog, and publishing docs

## 0.0.1

- Initial release
- Run `.m` scripts from the editor with a play button or `Ctrl+Shift+R`
- Text output in the Numbl output channel
- 2D/3D figure rendering in a webview panel
- Inline error diagnostics
- Configurable numbl command and extra workspace paths
- Notification when a newer version of numbl is available on npm
