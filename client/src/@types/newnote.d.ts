export interface TColorButton {
  buttonColor: string;
  isChoice: boolean;
  index: number;
  setColor: React.Dispatch<React.SetStateAction<string>>;
}

export interface TPenColor {
  penColor: string;
  useable: boolean;
}

export interface TChangePenWidthButton {
  strokeWidth: number;
  setStrokeWidth: React.Dispatch<React.SetStateAction<number>>;
}