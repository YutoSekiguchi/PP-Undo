export interface TSideBarMenu {
  label: string;
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
  path: string;
}

export interface TStrokeDataStrokes {
  data: any[] | undefined;
  pressure: number[];
  avgPressure: number[];
  svg: string | undefined;
}