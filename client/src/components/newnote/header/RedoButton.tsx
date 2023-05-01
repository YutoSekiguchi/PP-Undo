import React from "react";
import { useAtom } from 'jotai'
import { addHistoryAtom, historyForRedoAtom } from "@/infrastructures/jotai/drawer";
import { ButtonStyleType } from "@/@types/note";
import { FabricDrawer } from "@/modules/fabricdrawer";

export const RedoButton: React.FC<{fabricDrawer: FabricDrawer | null}> = ({ fabricDrawer }) => {
  const [historyForRedo, setHistoryForRedo] = useAtom(historyForRedoAtom);
  const [, addHistory] = useAtom(addHistoryAtom);

  const buttonStyle: ButtonStyleType = {
    backgroundColor: `${historyForRedo.length === 0? "#eee": "rgb(96, 165, 250)"}`,
    cursor: `${historyForRedo.length === 0? "not-allowed": "pointer"}`,
  }

  const redo = async () => {
    if (historyForRedo.length === 0) {return;}
    const lastHistoryForRedo = historyForRedo[historyForRedo.length - 1];
    if (lastHistoryForRedo) {
      if (lastHistoryForRedo.type === "pen") {
        fabricDrawer?.addStroke(lastHistoryForRedo.strokes[0]);
      } else if (lastHistoryForRedo.type === "erase") {
        for(var i=0; i<lastHistoryForRedo.strokes.length; i++) {
          fabricDrawer?.removeStroke(lastHistoryForRedo.strokes[i]);
        }
      }
      addHistory(lastHistoryForRedo);
      setHistoryForRedo(historyForRedo.splice(0, historyForRedo.length - 1));
    }
    // if (redoable[0] == false) {
    //   return;
    // }
    // const beforeRedoNoteImage = "";
    // const beforeRedoNoteImage = await getCurrentNoteImage();
    // const beforeRedoStrokeData = await getCurrentStrokeData(drawer.currentFigure.strokes);
    // console.log(drawer);
    // redo();
    // drawer.numOfStroke = drawer.numOfStroke + 1;
    // setDrawer(drawer);
    // plusRedoCount();
    // drawer.reDraw();
    // if (myNote != null) {
    //   myNote.StrokeData = drawer.currentFigure.strokes.concat();
    // }
    // // const afterRedoNoteImage = await getCurrentNoteImage();
    // const afterRedoNoteImage = "";
    // const afterRedoStrokeData = await getCurrentStrokeData(drawer.currentFigure.strokes);
    // await addRedoCount(
    //   {
    //     UID: myNote!.UID,
    //     NID: myNote!.ID,
    //     BeforeRedoNoteImage: beforeRedoNoteImage,
    //     BeforeRedoStrokeData: beforeRedoStrokeData,
    //     AfterRedoNoteImage: afterRedoNoteImage,
    //     AfterRedoStrokeData: afterRedoStrokeData,
    //     LeftStrokeCount: drawer.currentFigure.strokes.length,
    //   }
    // )
  }

  const redoIcon = (
    <svg
      className="undo-redo-svg"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.1459 11.0499L12.9716 9.05752L15.3462 8.84977C14.4471 7.98322 13.2242 7.4503 11.8769 7.4503C9.11547 7.4503 6.87689 9.68888 6.87689 12.4503C6.87689 15.2117 9.11547 17.4503 11.8769 17.4503C13.6977 17.4503 15.2911 16.4771 16.1654 15.0224L18.1682 15.5231C17.0301 17.8487 14.6405 19.4503 11.8769 19.4503C8.0109 19.4503 4.87689 16.3163 4.87689 12.4503C4.87689 8.58431 8.0109 5.4503 11.8769 5.4503C13.8233 5.4503 15.5842 6.24474 16.853 7.52706L16.6078 4.72412L18.6002 4.5498L19.1231 10.527L13.1459 11.0499Z"
        fill='white'
      />
    </svg>
  );

  return (
		<>
      <button
        className="undo-redo-button"
        {... {style: buttonStyle}}
        onClick={() => redo()}
      >
        {redoIcon}
      </button>
    </>
	);
}