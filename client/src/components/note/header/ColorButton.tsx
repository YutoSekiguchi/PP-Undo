import React, { useEffect } from "react";
import { useAtom } from 'jotai'
import { drawerAtom } from "@/infrastructures/jotai/drawer";
import { ColorButtonProps } from "@/@types/note";

export const ColorButton: React.FC<ColorButtonProps> = (props) => {
  const {buttonColor, isChoice, colorChange, index} = props;
  const [drawer, setDrawer] = useAtom(drawerAtom);

  const buttonStyle: {backgroundColor: string} = {
    backgroundColor: `${buttonColor}`,
  }
  
  const changeColor = (color: string) => {
    colorChange(index);
    // drawer.config.colors.originalPath = color;
    // drawer.config.colors.point = color;
    // drawer.config.colors.spline = color;
    drawer.config.colors.originalPoint = color;
    drawer.config.colors.dft = color;
    drawer.setStrokeColor(color);
    setDrawer(drawer);
  }

	return (
		<>
      <button 
        className={isChoice? "choice-color-button": "not-choice-color-button"}
        {... {style: buttonStyle}}
        onClick={() => changeColor(buttonColor)}
      ></button>
    </>
	);
}