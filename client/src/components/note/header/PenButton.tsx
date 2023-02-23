import React from "react";
import { useAtom } from 'jotai'
import { drawModeAtom, drawerAtom, drawerNumOfStrokeAtom, setUndoStrokeLogAtom } from "@/infrastructures/jotai/drawer";

export const PenButton: React.FC = () => {
  const [, setDrawMode] = useAtom(drawModeAtom);
  // const [drawer, setDrawer] = useAtom(drawerAtom);
  // const [numOfStroke, setNumOfStroke] = useAtom(drawerNumOfStrokeAtom);
  

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

  const setPenMode = () => {
    setDrawMode("pen");
  }

  const strokeEraseIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{color: "#000"}}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );

	return (
		<>
      <button
        className="undo-redo-button"
        // {... {style: buttonStyle}}
        onClick={() => setPenMode()}
      >
        {strokeEraseIcon}
      </button>
    </>
	);
}