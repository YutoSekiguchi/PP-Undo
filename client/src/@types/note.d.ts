import { FabricDrawer } from "@/modules/fabricdrawer";
import { FabricJSEditor } from "fabricjs-react";


export interface TNoteDataWithoutLongData {
  ID: number;
  NFID: number;
  UID: number;
  Title: string;
  Width: number;
  Height: number;
  AvgPressure: number;
  AvgPressureList: string;
  AllAvgPressureList: string;
  IsShowStrokeList: string;
  AllStrokeCount: number;
  StrokeCount: number;
  UndoCount: number;
  RedoCount: number;
  LogRedoCount: number;
  PPUndoCount: number;
  SliderValue: number | number[];
  BackgroundImage: string;
  CreatedAt: string;
}

export interface TDoughnutGraphConfig {
  backgroundColor?: string | string[];
  borderColor?: string;
}
export interface TDoughnutPressureGraphProps {
  pressureValue: number;
  title: string;
  graphLabel: string[];
  datasetsConfig: DoughnutGraphConfigType;
}

export interface TPPUndoGraphDatasetsConfig {
  label: string;
  borderColor: any;
  backgroundColor?: any;
  pointBackgroundColor?: any;
  fill?: boolean | string;
  smooth?: boolean;
  tension?: number;
  radius?: number;
  borderWidth?: number;
}


export interface TColorButton {
  buttonColor: string;
  isChoice: boolean;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  fabricDrawer: FabricDrawer;
}

export interface TButtonStyle {
  backgroundColor: "#eee" | "rgb(96, 165, 250)";
  cursor: "not-allowed" | "pointer";
}

export interface TPenColor {
  penColor: string;
  useable: boolean;
}

export interface TChangePenWidthButton {
  strokeWidth: number;
  setStrokeWidth: React.Dispatch<React.SetStateAction<number>>;
}

export interface TLogStrokeData {
  image: string;
  backgroundImage: string;
  createTime: string;
  sliderValue: number | number[];
  strokes: any[];
  svg: string;
  avgPressureList: number[];
  pressureList: number[];
}

export interface TAddText {
  mode: "circle"|"text"|"line"|"rect" = "text",
  text?: string,
  editor?: FabricJSEditor,
}

export interface TLogImageListProps {
  closeLog: () => void;
  fabricDrawer: FabricDrawer;
}

export interface TLogRedoImageDialogProps {
  dialogIndex: number;
  closeDialog: () => void;
  closeLog: () => void;
  fabricDrawer: FabricDrawer;
}

export interface TCancelButtonProps {
  half?: boolean;
  fontSize?: number;
  close: () => void;
}

export interface TPointDataList {
  pointerX: number;
  pointerY: number;
  tiltX: number;
  tiltY: number;
  pressure: number;
  time: number;
  canvasWidth: number;
  canvasHeight: number;
}

export interface TPostStrokeData {
  UID: number;
  NID: number;
  StrokeData: any;
  AvgPressure: number;
  PointDataList: {"data": TPointDataList[]};
  TransformPressure: number;
  PressureList: string;
  StartTime: number;
  EndTime: number;
  Time: number;
  Mode: string;
  Save: number;
  GroupNum?: number;
  IsGesture: number;
}

export interface TPostPPUndoCountsData {
  UID: number;
  NID: number;
  AfterPPUndoStrokeData: any;
  AfterPPUndoImageData: string;
  BeforePPUndoStrokeCount: number;
  AfterPPUndoStrokeCount: number;
  Now: number;
}

export interface TPostLogRedoCountsData {
  UID: number;
  NID: number;
  BeforeLogRedoNoteImage: string;
  BeforeLogRedoStrokeData: any;
  AfterLogRedoNoteImage: string;
  AfterLogRedoStrokeData: any;
  BeforeLogRedoStrokeCount: number;
  AfterLogRedoStrokeCount: number;
  Now: number;
}

export interface TPostLogData {
  UID: number;
  NID: number;
  StrokeData: any;
  LogImage: string;
  PressureList: string;
  AvgPressureList: string;
  Save: number;
  SliderValue: number | number[];
  BeforeLogRedoSliderValue: number | number[];
}

export interface TPostUndoCountData {
  UID: number;
  NID: number;
  BeforeUndoNoteImage: string;
  BeforeUndoStrokeData: any;
  AfterUndoNoteImage: string;
  AfterUndoStrokeData: any;
  LeftStrokeCount: number;
  Now: number;
}

export interface TPostRedoCountData {
  UID: number;
  NID: number;
  BeforeRedoNoteImage: string;
  BeforeRedoStrokeData: any;
  AfterRedoNoteImage: string;
  AfterRedoStrokeData: any;
  LeftStrokeCount: number;
  Now: number;
}

export interface TPostEraseSelectedObjectsCountData {
  UID: number;
  NID: number;
  BeforeEraseSelectedObjectsNoteImage: string;
  BeforeEraseSelectedObjectsStrokeData: any;
  AfterEraseSelectedObjectsNoteImage: string;
  AfterEraseSelectedObjectsStrokeData: any;
  BeforeEraseSelectedObjectsStrokeCount: number;
  AfterEraseSelectedObjectsStrokeCount: Number;
  Now: number;
}

interface TIDAndCreatedAt {
  ID: number;
  CreatedAt: string;
}
export interface TPostClientLogData {
  NID: number;
  Data: any;
}

export interface TClientLogData extends TPostClientLogData, TIDAndCreatedAt {}

export interface TStrokeData extends TPostStrokeData, TIDAndCreatedAt {}

export interface TLogData extends TPostLogData, TIDAndCreatedAt {}