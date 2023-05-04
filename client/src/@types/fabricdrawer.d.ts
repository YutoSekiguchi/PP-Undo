import { FabricDrawer } from "@/modules/fabricdrawer";
import { FabricJSEditor } from "fabricjs-react";

export interface TAddText {
  mode: "circle"|"text"|"line"|"rect" = "text",
  text?: string,
  editor?: FabricJSEditor,
}

export interface TLogImageListProps {
  closeLog: () => void;
  fabricDrawer: FabricDrawer | null;
}

export interface TLogRedoImageDialogProps {
  dialogIndex: number;
  closeDialog: () => void;
  closeLog: () => void;
  fabricDrawer: FabricDrawer | null;
}