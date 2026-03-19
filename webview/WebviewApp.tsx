import { useReducer, useEffect, useState, useCallback } from "react";
import { FigureView } from "./graphics/FigureView.js";
import {
  figuresReducer,
  initialFiguresState,
  type FiguresAction,
} from "./graphics/figuresReducer.js";
import { restoreNaNs } from "./graphics/restoreNaNs.js";

// Acquire the VS Code API handle (available in webview context)
const vscode = (window as any).acquireVsCodeApi?.();

export function WebviewApp() {
  const [figures, dispatch] = useReducer(figuresReducer, initialFiguresState);
  const [activeFigure, setActiveFigure] = useState(1);

  const handlePlotInstruction = useCallback(
    (instruction: FiguresAction) => {
      dispatch(instruction);
      if (instruction.type === "set_figure_handle") {
        setActiveFigure(instruction.handle);
      } else if (instruction.type === "close_all") {
        setActiveFigure(1);
      }
    },
    []
  );

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const msg = event.data;
      if (msg.type === "clear") {
        dispatch({ type: "clear" });
        setActiveFigure(1);
        return;
      }
      if (msg.type === "drawnow" && Array.isArray(msg.plotInstructions)) {
        for (const instr of msg.plotInstructions) {
          restoreNaNs(instr);
          handlePlotInstruction(instr);
        }
      }
    };
    window.addEventListener("message", handler);

    // Signal to the extension host that we're ready to receive messages
    vscode?.postMessage({ type: "ready" });

    return () => window.removeEventListener("message", handler);
  }, [handlePlotInstruction]);

  // Fall back to highest handle if active figure was closed
  const effectiveActiveFigure = (() => {
    if (figures.figs[activeFigure]) return activeFigure;
    const handles = Object.keys(figures.figs).map(Number);
    if (handles.length === 0) return activeFigure;
    return handles.sort((a, b) => a - b)[handles.length - 1];
  })();

  const handles = Object.keys(figures.figs)
    .map(Number)
    .sort((a, b) => a - b);
  const currentFig = figures.figs[effectiveActiveFigure];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#1e1e1e" }}>
      {/* Tab bar */}
      {handles.length > 1 && (
        <div style={tabBarStyle}>
          {handles.map(h => (
            <button
              key={h}
              onClick={() => setActiveFigure(h)}
              style={h === effectiveActiveFigure ? activeTabStyle : tabStyle}
            >
              Figure {h}
            </button>
          ))}
        </div>
      )}

      {/* Canvas area */}
      <div style={{ flex: 1, position: "relative" }}>
        {currentFig ? (
          <div style={{ position: "absolute", inset: 0 }}>
            <FigureView figure={currentFig} />
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#999",
              fontFamily: "sans-serif",
            }}
          >
            Waiting for plot data...
          </div>
        )}
      </div>
    </div>
  );
}

const tabBarStyle: React.CSSProperties = {
  display: "flex",
  gap: 2,
  padding: "4px 8px",
  background: "#2d2d2d",
  borderBottom: "1px solid #444",
};

const tabStyle: React.CSSProperties = {
  padding: "4px 12px",
  border: "1px solid #444",
  borderBottom: "none",
  background: "#333",
  color: "#ccc",
  cursor: "pointer",
  fontFamily: "sans-serif",
  fontSize: 13,
  borderRadius: "4px 4px 0 0",
};

const activeTabStyle: React.CSSProperties = {
  ...tabStyle,
  background: "#1e1e1e",
  color: "#fff",
  fontWeight: "bold",
};
