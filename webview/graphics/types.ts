/**
 * Plot type definitions extracted from numbl's runtime.
 * These are the data types passed via the --stream NDJSON protocol.
 */

export interface PlotTrace {
  x: number[];
  y: number[];
  lineStyle?: string;
  marker?: string;
  color?: [number, number, number];
  lineWidth?: number;
  markerSize?: number;
  markerEdgeColor?: [number, number, number];
  markerFaceColor?: [number, number, number];
  markerIndices?: number[];
}

export interface Plot3Trace {
  x: number[];
  y: number[];
  z: number[];
  lineStyle?: string;
  marker?: string;
  color?: [number, number, number];
  lineWidth?: number;
  markerSize?: number;
  markerEdgeColor?: [number, number, number];
  markerFaceColor?: [number, number, number];
  markerIndices?: number[];
}

export interface SurfTrace {
  x: number[];
  y: number[];
  z: number[];
  rows: number;
  cols: number;
  c?: number[];
  edgeColor?: [number, number, number] | "none" | "flat" | "interp";
  faceColor?:
    | [number, number, number]
    | "flat"
    | "interp"
    | "none"
    | "texturemap";
  faceAlpha?: number;
}

export interface ImagescTrace {
  x: [number, number];
  y: [number, number];
  z: number[];
  rows: number;
  cols: number;
}

export interface ContourTrace {
  x: number[];
  y: number[];
  z: number[];
  rows: number;
  cols: number;
  nLevels: number;
  filled: boolean;
}

export type PlotInstruction =
  | { type: "set_figure_handle"; handle: number }
  | { type: "plot"; traces: PlotTrace[] }
  | { type: "plot3"; traces: Plot3Trace[] }
  | { type: "surf"; trace: SurfTrace }
  | { type: "imagesc"; trace: ImagescTrace }
  | { type: "contour"; trace: ContourTrace }
  | { type: "mesh"; trace: SurfTrace }
  | { type: "set_hold"; value: boolean }
  | { type: "set_title"; text: string }
  | { type: "set_xlabel"; text: string }
  | { type: "set_ylabel"; text: string }
  | { type: "set_zlabel"; text: string }
  | { type: "set_shading"; shading: "faceted" | "flat" | "interp" }
  | { type: "close" }
  | { type: "close_all" }
  | { type: "clf" }
  | { type: "set_subplot"; rows: number; cols: number; index: number }
  | { type: "set_legend"; labels: string[] }
  | { type: "set_sgtitle"; text: string }
  | { type: "set_grid"; value: boolean }
  | { type: "set_colorbar"; value: string }
  | { type: "set_colormap"; name: string }
  | { type: "set_axis"; value: string }
  | { type: "set_view"; az: number; el: number };
