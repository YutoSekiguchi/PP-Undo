export interface ColorButtonProps {
  buttonColor: string;
  isChoice: boolean;
  colorChange: (index: number) => void;
  index: number;
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