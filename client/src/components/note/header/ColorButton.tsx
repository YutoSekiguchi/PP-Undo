import React from "react";
import { useAtom } from 'jotai'
import { drawerAtom } from "@/infrastructures/jotai/Drawer";

type Props = {
  buttonColor: string,
}

export const ColorButton: React.FC<Props> = (props) => {
  const [drawer, setDrawer] = useAtom<any, any, any>(drawerAtom);
  const {buttonColor} = props;

  const buttonStyle = {
    width: "25px",
    height: "25px",
    backgroundColor: `${buttonColor}`,
    borderRadius: "100px",
    margin: "0 3px",
    border: "1px solid gray",
    cursor: "pointer",
    // boxShadow: `0 0 ${8*isChoice}px #000`
  }
  
  const changeColor = (color: string) => {
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