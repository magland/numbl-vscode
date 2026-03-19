import { createRoot } from "react-dom/client";
import { WebviewApp } from "./WebviewApp.js";

const root = createRoot(document.getElementById("root")!);
root.render(<WebviewApp />);
