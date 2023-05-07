import React, { useState } from "react";
import { LogRedoImageDialogProps, PostLogRedoCountsDataType } from "@/@types/note";
import { useAtom } from "jotai";
import { addAvgPressureOfStrokeAtom, clearAvgPressureOfStrokeAtom, clearUndoStrokeLogAtom, drawerAtom, historyAtom, historyForRedoAtom, logOfBeforePPUndoAtom, logRedoCountAtom, sliderValueAtom, undoableCountAtom } from "@/infrastructures/jotai/drawer";
import { Box, Button } from "@mui/material";
import { CancelButton } from "./CancelButton";
import { getCurrentStrokeData } from "@/modules/note/GetCurrentStrokeData";
import { calcIsShowStrokeCount } from "@/modules/note/CalcIsShowStroke";
import { myNoteAtom } from "@/infrastructures/jotai/notes";
import { addLogRedoCount } from "@/infrastructures/services/ppUndoLogs/counts";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { TLogRedoImageDialogProps } from "@/@types/fabricdrawer";
import { rgbToHex } from "@/modules/note/RGBToHex";


export const LogRedoImageDialog: React.FC<TLogRedoImageDialogProps> = (props) => {
  const { dialogIndex, closeDialog, closeLog, fabricDrawer } = props;
  const [, setSliderValue] = useAtom(sliderValueAtom);
  const [logOfBeforePPUndo, ] = useAtom(logOfBeforePPUndoAtom);
  const [, setClearAvgPressureOfStroke] = useAtom(clearAvgPressureOfStrokeAtom);
  const [, setAddAvgPressureOfStroke] = useAtom(addAvgPressureOfStrokeAtom);
  const [, setClearUndoStrokeLog] = useAtom(clearUndoStrokeLogAtom);
  const [, setUndoableCount] = useAtom(undoableCountAtom);
  const [logRedoCount, setLogRedoCount] = useAtom(logRedoCountAtom);
  const [isLoadingScreen, setIsLoadingScreen] = useState<boolean>(false);
  const [, setHistory] = useAtom(historyAtom);
  const [, setHistoryForRedo] = useAtom(historyForRedoAtom);
  const [myNote, ] = useAtom(myNoteAtom);

  const ppRedo = async () => {
    setIsLoadingScreen(true);

    const beforeLogRedoNoteImage = fabricDrawer?.getImg();
    const beforeLogRedoStrokeData = {"Strokes": {"data": fabricDrawer?.editor.canvas.getObjects(), "pressure": fabricDrawer!.getPressureList(), "svg": fabricDrawer?.getSVG()}};
    const beforeLogRedoStrokeCount = fabricDrawer?.getStrokeLength();
    
    fabricDrawer?.clear();
    fabricDrawer?.setSVGFromString(logOfBeforePPUndo[dialogIndex].svg!)
    for(let i=0; i<logOfBeforePPUndo[dialogIndex].pressureList!.length; i++) {
      if (fabricDrawer?.editor.canvas._objects[i].stroke!.slice(0, 3) === "rgb") {
        fabricDrawer.editor.canvas._objects[i].stroke = rgbToHex(fabricDrawer.editor.canvas._objects[i].stroke!)
      }
      Object.assign(fabricDrawer!.editor.canvas._objects[i], { pressure: logOfBeforePPUndo[dialogIndex].pressureList![i] });
    }
    fabricDrawer?.reDraw();
    setSliderValue(logOfBeforePPUndo[dialogIndex].sliderValue!);

    const afterLogRedoNoteImage = fabricDrawer?.getImg();
    const afterLogRedoStrokeData = {"Strokes": {"data": fabricDrawer?.editor.canvas.getObjects(), "pressure": fabricDrawer!.getPressureList(), "svg": fabricDrawer?.getSVG()}};
    const afterLogRedoStrokeCount = fabricDrawer?.getStrokeLength();
    const postLogRedoCountData: PostLogRedoCountsDataType = {
      UID: myNote?.UID? myNote?.UID: 0,
      NID: myNote?.ID? myNote?.ID: 0,
      // BeforeLogRedoNoteImage: beforeLogRedoNoteImage!,
      BeforeLogRedoNoteImage: "",
      BeforeLogRedoStrokeData: beforeLogRedoStrokeData,
      // AfterLogRedoNoteImage: afterLogRedoNoteImage!,
      AfterLogRedoNoteImage: "",
      AfterLogRedoStrokeData: afterLogRedoStrokeData,
      BeforeLogRedoStrokeCount: beforeLogRedoStrokeCount!,
      AfterLogRedoStrokeCount: afterLogRedoStrokeCount!,
    };
    await addLogRedoCount(postLogRedoCountData);

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
      <Box className="width100 dialog-image-wrapper">
        <Box className="width100">
          <Box sx={{
            backgroundImage: `url("${logOfBeforePPUndo[dialogIndex].backgroundImage}")`,
            }}
          >
            <img
              className="dialog-image"
              src={logOfBeforePPUndo[dialogIndex].image}
            >
            </img>
          </Box>
        </Box>
        <Button
          variant="contained"
          color="secondary"
          onClick={ppRedo}
        >
          Redo
        </Button>
      </Box>
    </Box>
  )
}