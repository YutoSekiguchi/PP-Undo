export interface ColorButtonProps {
  buttonColor: string;
  isChoice: boolean;
  colorChange: (index: number) => void;
  index: number;
}

export interface LogImageListProps {
  closeLog: () => void;
}

export interface LogRedoImageDialogProps {
  dialogIndex: number;
  closeDialog: () => void;
  closeLog: () => void;
}

export interface CancelButtonProps {
  half?: boolean;
  fontSize?: number;
  close: () => void;
}

export interface NoteSizeType {
  width: number | string;
  height: number | string;
}

export interface PenColorType {
  penColor: string;
  useable: boolean;
}

export interface ButtonStyleType {
  backgroundColor: "#eee" | "rgb(96, 165, 250)";
  cursor: "not-allowed" | "pointer";
}

export interface Point2Type {
  x: number;
  y: number;
  z: number;
  time: number;
}

export interface PPUndoGraphDatasetsConfigType {
  label: string;
  borderColor: string;
  backgroundColor?: string;
  fill?: boolean | string;
  smooth?: boolean;
  tension?: number;
  radius?: number;
  borderWidth?: number;
}

export interface DoughnutGraphConfigType {
  backgroundColor?: string | string[];
  borderColor?: string;

}

export interface PointType {
  x: number;
  y: number;
  z: number;
}

export interface StrokeType {
  points: PointType[];
  color: string;
  strokeWidth: number;
  strokeAvgPressure: number;
}

export interface LogStrokeDataType {
  image?: string;
  createTime: string;
  sliderValue?: number | number[];
  strokes: StrokeType[];
}

export interface DoughnutPressureGraphPropsType {
  pressureValue: number;
  title: string;
  graphLabel: string[];
  datasetsConfig: DoughnutGraphConfigType;
}

interface IDAndCreatedAtType {
  ID: number;
  CreatedAt: string;
}

export interface PostStrokeDataType {
  UID: number;
  NID: number;
  StrokeData: any;
  AvgPressure: number;
  PressureList: string;
  Time?: number;
  Mode: string;
  Save: number;
}

export interface StrokeDataType extends PostStrokeDataType, IDAndCreatedAtType {}

export interface PostUndoCountDataType {
  UID: number;
  NID: number;
  BeforeUndoNoteImage: string;
  BeforeUndoStrokeData: any;
  AfterUndoNoteImage: string;
  AfterUndoStrokeData: any;
  LeftStrokeCount: number;
}

export interface PostRedoCountDataType {
  UID: number;
  NID: number;
  BeforeRedoNoteImage: string;
  BeforeRedoStrokeData: any;
  AfterRedoNoteImage: string;
  AfterRedoStrokeData: any;
  LeftStrokeCount: number;
}

export interface PostLogDataType {
  UID: number;
  NID: number;
  StrokeData: any;
  LogImage: string;
  AvgPressureList: string;
  Save: number;
  SliderValue: number | number[];
  BeforeLogRedoSliderValue: number | number[];
}

export interface LogDataType extends PostLogDataType, IDAndCreatedAtType {}