import React from "react";
import { useAtom } from 'jotai'
import { ButtonStyleType } from "@/@types/note";
import { addHistoryForRedoAtom, historyAtom } from "@/infrastructures/jotai/drawer";
import { FabricDrawer } from "@/modules/fabricdrawer";

export const UndoButton: React.FC<{fabricDrawer: FabricDrawer | null}> = ({ fabricDrawer }) => {
  const [history, setHistory] = useAtom(historyAtom);
  const [, addHistoryForRedo] = useAtom(addHistoryForRedoAtom);

  const buttonStyle: ButtonStyleType = {
    backgroundColor: `${history.length === 0 ?"#eee": "rgb(96, 165, 250)"}`,
    cursor: `${history.length === 0 ?"not-allowed" :"pointer"}`,
  }


  const undo = async () => {
    if (history.length === 0) {return;}
    const lastHistory = history[history.length - 1];
    if (lastHistory) {
      if (lastHistory.type === "pen") {
        fabricDrawer?.removeStroke(lastHistory.strokes[0])
      } else if (lastHistory.type === "erase") {
        for(var i=0; i<lastHistory.strokes.length; i++) {
          fabricDrawer?.addStroke(lastHistory.strokes[i]);
        }
      }
      addHistoryForRedo(lastHistory);
      setHistory(history.splice(0, history.length - 1));
    }
    // if (undoableCount <= 0 || drawer.numOfStroke<=0) {
    //   return;
    // }
    // addLog({
    //   stroke: drawer.currentFigure.strokes[drawer.currentFigure.strokes.length-1],
    //   pressure: avgPressureOfStroke[drawer.currentFigure.strokes.length-1]
    // });
    // const beforeUndoNoteImage = await getCurrentNoteImage();
    // const beforeUndoNoteImage = "";
    // const beforeUndoStrokeData = await getCurrentStrokeData(drawer.currentFigure.strokes);
    // removeAvgPressureOfStroke(drawer.currentFigure.strokes.length-1);
    // drawer.undo();
    // plusUndoCount();
    // setDrawer(drawer);
    // setUndoableCount(undoableCount-1);
    // drawer.reDraw();
    // if (myNote != null) {
    //   myNote.StrokeData = drawer.currentFigure.strokes.concat();
    // }
    // const afterUndoNoteImage = await getCurrentNoteImage();
    // const afterUndoNoteImage = "";
    // const afterUndoStrokeData = await getCurrentStrokeData(drawer.currentFigure.strokes);
    // await addUndoCount(
    //   {
    //     UID: myNote!.UID,
    //     NID: myNote!.ID,
    //     BeforeUndoNoteImage: beforeUndoNoteImage,
    //     BeforeUndoStrokeData: beforeUndoStrokeData,
    //     AfterUndoNoteImage: afterUndoNoteImage,
    //     AfterUndoStrokeData: afterUndoStrokeData,
    //     LeftStrokeCount: drawer.currentFigure.strokes.length,
    //   }
    // )
  }

  const undoIcon = (
    <svg
      className="undo-redo-svg"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.33929 4.46777H7.33929V7.02487C8.52931 6.08978 10.0299 5.53207 11.6607 5.53207C15.5267 5.53207 18.6607 8.66608 18.6607 12.5321C18.6607 16.3981 15.5267 19.5321 11.6607 19.5321C9.51025 19.5321 7.58625 18.5623 6.30219 17.0363L7.92151 15.8515C8.83741 16.8825 10.1732 17.5321 11.6607 17.5321C14.4222 17.5321 16.6607 15.2935 16.6607 12.5321C16.6607 9.77065 14.4222 7.53207 11.6607 7.53207C10.5739 7.53207 9.56805 7.87884 8.74779 8.46777L11.3393 8.46777V10.4678H5.33929V4.46777Z"
        fill='white'
      />
    </svg>
  );

	return (
		<>
      <button
        className="undo-redo-button"
        {... {style: buttonStyle}}
        onClick={() => undo()}
      >
        {undoIcon}
      </button>
    </>
	);
}