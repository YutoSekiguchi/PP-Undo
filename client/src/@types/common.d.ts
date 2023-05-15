export interface TSideBarMenu {
  label: string;
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
  path: string;
}