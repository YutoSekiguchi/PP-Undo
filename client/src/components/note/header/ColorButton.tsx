import React from "react";
import { useAtom } from 'jotai'
import { drawerAtom } from "@/infrastructures/jotai/drawer";

interface Props {
  buttonColor: string,
  isChoice: boolean,
  colorChange: (index: number) => void,
  index: number
}

export const ColorButton: React.FC<Props> = (props) => {
  const {buttonColor, isChoice, colorChange, index} = props;
  const [drawer, setDrawer] = useAtom<any, any, any>(drawerAtom);

  const buttonStyle = {
    width: `${isChoice? "28px": "25px"}`,
    height: `${isChoice? "28px": "25px"}`,
    backgroundColor: `${buttonColor}`,
    borderRadius: "100px",
    margin: "0 3px",
    border: "1px solid gray",
    cursor: "pointer",
    boxShadow: `0 0 ${isChoice? "8px": "0px"} #fff`,
  }
  
  const changeColor = (color: string) => {
    colorChange(index);
    drawer.setStrokeColor(color);
    drawer.config.colors.originalPoint = color;
    setDrawer(drawer);
  }

	return (
		<>
      <button 
        {... {style: buttonStyle}}
        onClick={() => changeColor(buttonColor)}
      ></button>
    </>
	);
}