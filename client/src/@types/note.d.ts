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

export interface StrokeDataType {
  image?: string;
  createTime: string;
  strokes: StrokeType[];
}