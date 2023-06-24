import React, { useState } from "react";
import { TPostLogRedoCountsData } from "@/@types/note";
import { useAtom } from "jotai";
import { historyAtom, historyForRedoAtom, isDemoAtom, logOfBeforePPUndoAtom, logRedoCountAtom, noteAspectRatiotAtom, sliderValueAtom } from "@/infrastructures/jotai/drawer";
import { Box, Button } from "@mui/material";
import { CancelButton } from "./CancelButton";
import { myNoteAtom } from "@/infrastructures/jotai/notes";
import { addLogRedoCount } from "@/infrastructures/services/ppUndoLogs/counts";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { TLogRedoImageDialogProps } from "@/@types/note";
import { rgbToHex } from "@/modules/note/RGBToHex";
import { NOTE_WIDTH_RATIO, PRESSURE_ROUND_VALUE } from "@/configs/settings";
import Spacer from "@/components/common/Spacer";


export const LogRedoImageDialog: React.FC<TLogRedoImageDialogProps> = (props) => {
  const { dialogIndex, closeDialog, closeLog, fabricDrawer } = props;
  const [, setSliderValue] = useAtom(sliderValueAtom);
  const [logOfBeforePPUndo, ] = useAtom(logOfBeforePPUndoAtom);
  const [logRedoCount, setLogRedoCount] = useAtom(logRedoCountAtom);
  const [isLoadingScreen, setIsLoadingScreen] = useState<boolean>(false);
  const [, setHistory] = useAtom(historyAtom);
  const [, setHistoryForRedo] = useAtom(historyForRedoAtom);
  const [myNote, ] = useAtom(myNoteAtom);
  const [noteAspectRatio, ] = useAtom(noteAspectRatiotAtom);
  const [isDemo, ] = useAtom(isDemoAtom);

  const ppRedo = async () => {
    setIsLoadingScreen(true);

    const beforeLogRedoNoteImage = fabricDrawer.getImg();
    const beforeLogRedoStrokeData = {"Strokes": {"data": fabricDrawer.editor.canvas.getObjects(), "pressure": fabricDrawer.getPressureList(), "svg": fabricDrawer.getSVG()}};
    const beforeLogRedoStrokeCount = fabricDrawer?.getStrokeLength();
    
    fabricDrawer.clear();
    fabricDrawer.setSVGFromString(logOfBeforePPUndo[dialogIndex].svg)
    for(let i=0; i<logOfBeforePPUndo[dialogIndex].pressureList.length; i++) {
      if (fabricDrawer.editor.canvas._objects[i].stroke!.slice(0, 3) === "rgb") {
        fabricDrawer.editor.canvas._objects[i].stroke = rgbToHex(fabricDrawer.editor.canvas._objects[i].stroke!)
      }
      Object.assign(fabricDrawer.editor.canvas._objects[i], { pressure: logOfBeforePPUndo[dialogIndex].pressureList[i] });
      Object.assign(fabricDrawer.editor.canvas._objects[i], { averagePressure: logOfBeforePPUndo[dialogIndex].pressureList[i] });
    }
    fabricDrawer?.reDraw();
    setSliderValue(logOfBeforePPUndo[dialogIndex].sliderValue);

    const afterLogRedoNoteImage = fabricDrawer.getImg();
    const afterLogRedoStrokeData = {"Strokes": {"data": fabricDrawer.editor.canvas.getObjects(), "pressure": fabricDrawer.getPressureList(), "svg": fabricDrawer.getSVG()}};
    const afterLogRedoStrokeCount = fabricDrawer.getStrokeLength();
    
    if(!isDemo) {
      const postLogRedoCountData: TPostLogRedoCountsData = {
        UID: myNote?.UID? myNote?.UID: 0,
        NID: myNote?.ID? myNote?.ID: 0,
        // BeforeLogRedoNoteImage: beforeLogRedoNoteImage!,
        BeforeLogRedoNoteImage: "",
        BeforeLogRedoStrokeData: beforeLogRedoStrokeData,
        // AfterLogRedoNoteImage: afterLogRedoNoteImage!,
        AfterLogRedoNoteImage: "",
        AfterLogRedoStrokeData: afterLogRedoStrokeData,
        BeforeLogRedoStrokeCount: beforeLogRedoStrokeCount,
        AfterLogRedoStrokeCount: afterLogRedoStrokeCount,
        Now: Math.round(performance.now() * PRESSURE_ROUND_VALUE) / PRESSURE_ROUND_VALUE
      };
      await addLogRedoCount(postLogRedoCountData);
    }

    setHistory([]);
    setHistoryForRedo([]);
    setLogRedoCount(logRedoCount + 1);
    closeDialog();
    closeLog();
    setIsLoadingScreen(false);
  }

  return (
    <Box className="dialog-image-container">
      {
        isLoadingScreen?
        <LoadingScreen />
        :<></>
      }
      <CancelButton
        close={closeDialog}
      />
      <Box 
        className="dialog-image-wrapper"
        sx={{
          width: window.innerWidth * NOTE_WIDTH_RATIO,
        }}
      >
        <Box className="width100">
          <Box sx={{
            backgroundImage: `url("${logOfBeforePPUndo[dialogIndex].backgroundImage}")`,
            backgroundSize: "contain",
            width: window.innerWidth * NOTE_WIDTH_RATIO,
            height: window.innerWidth * NOTE_WIDTH_RATIO * noteAspectRatio,
            backgroundColor: "white"
            }}
          >
            <img
              className="dialog-image"
              src={logOfBeforePPUndo[dialogIndex].image}
            >
            </img>
          </Box>
        </Box>
        <Spacer size={24} />
        <Button
          variant="contained"
          color="secondary"
          onClick={ppRedo}
        >
          Redo
        </Button>
        <Spacer size={128} />
      </Box>
    </Box>
  )
}