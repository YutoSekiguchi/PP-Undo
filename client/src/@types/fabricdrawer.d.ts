import { FabricJSEditor } from "fabricjs-react";

export interface TAddText {
  mode: "circle"|"text"|"line"|"rect" = "text",
  text?: string,
  editor?: FabricJSEditor,
}