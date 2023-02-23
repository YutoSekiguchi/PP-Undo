import React from "react";
import { useAtom } from 'jotai'
import { drawModeAtom, drawerAtom, drawerNumOfStrokeAtom, setUndoStrokeLogAtom } from "@/infrastructures/jotai/drawer";

export const StrokeEraseButton: React.FC = () => {
  const [, setDrawMode] = useAtom(drawModeAtom);
  const [drawer, setDrawer] = useAtom(drawerAtom);
  const [numOfStroke, setNumOfStroke] = useAtom(drawerNumOfStrokeAtom);
  

  // const buttonStyle: ButtonStyleType = {
  //   backgroundColor: `${numOfStroke==0 ?"#eee": "rgb(96, 165, 250)"}`,
  //   cursor: `${numOfStroke==0 ?"not-allowed" :"pointer"}`,
  // }

  // const undo = () => {
  //   if (numOfStroke == 0) {
  //     return;
  //   }
  //   addLog(drawer.currentFigure.strokes[drawer.currentFigure.strokes.length-1]);
  //   drawer.undo();
  //   setDrawer(drawer);
  //   setNumOfStroke(drawer.numOfStroke);
  //   drawer.reDraw();
  // }

  const setEraseMode = () => {
    setDrawMode("strokeErase");
  }

  const strokeEraseIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 199.997 200" stroke="currentColor" strokeWidth={2} style={{color: "#444"}}>
      <path d="M235.177,4027.791l38.549-38.552,83.632-83.63-77.816-77.818-83.632,83.635-38.549,38.549Zm31.834-45.265L235.735,4013.8l-64.386-64.392,31.274-31.274Z" transform="translate(-157.361 -3827.791)"/>
    </svg>
  );

	return (
		<>
      <button
        className="undo-redo-button"
        // {... {style: buttonStyle}}
        onClick={() => setEraseMode()}
      >
        {strokeEraseIcon}
      </button>
    </>
	);
}