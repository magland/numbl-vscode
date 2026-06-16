import type { PlotInstruction } from "./types.js";

/** Restore NaN/Infinity values that were converted to null by JSON
 *  serialization. numbl's CLI streams plot instructions as NDJSON, and
 *  `JSON.stringify` turns NaN/Infinity into `null`; this walks the numeric
 *  arrays of each instruction and turns them back into NaN so the renderer
 *  draws gaps/skips correctly. (The in-browser IDE uses structured clone and
 *  doesn't need this.) */
function restoreNullsToNaN(arr: number[] | undefined): void {
  if (!arr) return;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === null) (arr as number[])[i] = NaN;
  }
}

export function restoreNaNs(instr: PlotInstruction): void {
  switch (instr.type) {
    case "plot":
    case "line":
    case "area":
      for (const t of instr.traces) {
        restoreNullsToNaN(t.x);
        restoreNullsToNaN(t.y);
      }
      break;
    case "plot3":
    case "line3":
      for (const t of instr.traces) {
        restoreNullsToNaN(t.x);
        restoreNullsToNaN(t.y);
        restoreNullsToNaN(t.z);
      }
      break;
    case "surf":
    case "mesh":
    case "surface":
      restoreNullsToNaN(instr.trace.x);
      restoreNullsToNaN(instr.trace.y);
      restoreNullsToNaN(instr.trace.z);
      restoreNullsToNaN(instr.trace.c);
      break;
    case "imagesc":
      restoreNullsToNaN(instr.trace.z);
      break;
    case "contour":
      restoreNullsToNaN(instr.trace.x);
      restoreNullsToNaN(instr.trace.y);
      restoreNullsToNaN(instr.trace.z);
      break;
    case "pcolor":
      restoreNullsToNaN(instr.trace.x);
      restoreNullsToNaN(instr.trace.y);
      restoreNullsToNaN(instr.trace.c);
      break;
    case "bar":
    case "barh":
      for (const t of instr.traces) {
        restoreNullsToNaN(t.x);
        restoreNullsToNaN(t.y);
      }
      break;
    case "bar3":
    case "bar3h":
      restoreNullsToNaN(instr.trace.x);
      restoreNullsToNaN(instr.trace.y);
      restoreNullsToNaN(instr.trace.z);
      break;
    case "errorbar":
      for (const t of instr.traces) {
        restoreNullsToNaN(t.x);
        restoreNullsToNaN(t.y);
        restoreNullsToNaN(t.yNeg);
        restoreNullsToNaN(t.yPos);
        restoreNullsToNaN(t.xNeg);
        restoreNullsToNaN(t.xPos);
      }
      break;
    case "quiver":
      for (const t of instr.traces) {
        restoreNullsToNaN(t.x);
        restoreNullsToNaN(t.y);
        restoreNullsToNaN(t.u);
        restoreNullsToNaN(t.v);
      }
      break;
    case "quiver3":
      restoreNullsToNaN(instr.trace.x);
      restoreNullsToNaN(instr.trace.y);
      restoreNullsToNaN(instr.trace.z);
      restoreNullsToNaN(instr.trace.u);
      restoreNullsToNaN(instr.trace.v);
      restoreNullsToNaN(instr.trace.w);
      break;
    case "heatmap":
      restoreNullsToNaN(instr.trace.data);
      break;
    case "boxchart":
      // BoxTrace fields are mostly scalars; outliers is the only array.
      for (const t of instr.traces) {
        restoreNullsToNaN(t.outliers);
      }
      break;
    case "piechart":
      restoreNullsToNaN(instr.trace.values);
      break;
  }
}
