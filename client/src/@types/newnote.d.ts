export interface TColorButton {
  buttonColor: string;
  isChoice: boolean;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  fabricDrawer: FabricDrawer | null;
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
  image?: string;
  backgroundImage?: string;
  createTime: string;
  sliderValue?: number | nubmer[];
  strokes?: any[];
  svg?: string;
  pressureList?: number[];
}