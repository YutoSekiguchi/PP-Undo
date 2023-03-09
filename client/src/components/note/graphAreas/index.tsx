import React from "react";
import { useAtom } from 'jotai'
import { drawerAtom } from "@/infrastructures/jotai/drawer";
import {
  Box 
} from "@mui/material";
import { PPUndoArea } from "./PPUndoArea";
import { LogRedo } from "./LogRedo";
import { NowPressureGraphArea } from "./NowPressureGraphArea";
import { AvgPressureGraphArea } from "./AvgPressureGraphArea";

export const NoteGraphAreas: React.FC = () => {
  // const {buttonColor, isChoice, colorChange, index} = props;
  // const [drawer, setDrawer] = useAtom(drawerAtom);

  // const buttonStyle: {backgroundColor: string} = {
  //   backgroundColor: `${buttonColor}`,
  // }
  
  // const changeColor = (color: string) => {
  //   colorChange(index);
  //   drawer.setStrokeColor(color);
  //   drawer.config.colors.originalPoint = color;
  //   setDrawer(drawer);
  // }

	return (
    <Box className="graph-area">
      <PPUndoArea />
      <LogRedo />
      <Box className="graph-wrapper graph-wrapper-height">
        <NowPressureGraphArea />
        <AvgPressureGraphArea />
      </Box>
    </Box>
	);
}