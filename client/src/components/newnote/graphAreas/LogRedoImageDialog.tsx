import React, { useState } from "react";
import { LogRedoImageDialogProps, PostLogRedoCountsDataType } from "@/@types/note";
import { useAtom } from "jotai";
import { addAvgPressureOfStrokeAtom, clearAvgPressureOfStrokeAtom, clearUndoStrokeLogAtom, drawerAtom, logOfBeforePPUndoAtom, logRedoCountAtom, sliderValueAtom, undoableCountAtom } from "@/infrastructures/jotai/drawer";
import { Box, Button } from "@mui/material";
import { CancelButton } from "./CancelButton";
import { getCurrentStrokeData } from "@/modules/note/GetCurrentStrokeData";
import { calcIsShowStrokeCount } from "@/modules/note/CalcIsShowStroke";
import { myNoteAtom } from "@/infrastructures/jotai/notes";
import { addLogRedoCount } from "@/infrastructures/services/ppUndoLogs/counts";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { TLogRedoImageDialogProps } from "@/@types/fabricdrawer";


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
  const [myNote, ] = useAtom(myNoteAtom);

  const ppRedo = async () => {
    setIsLoadingScreen(true);
    const beforeLogRedoNoteImage = fabricDrawer?.getImg();
    // const beforeLogRedoStrokeData = await getCurrentStrokeData(drawer.currentFigure.strokes);
    // const beforeLogRedoStrokeCount = calcIsShowStrokeCount(drawer.currentFigure.strokes);
    // setClearAvgPressureOfStroke();
    // const numOfStroke = drawer.numOfStroke;
    // if(numOfStroke <= 0) return
    // drawer.currentFigure.strokes = []
    // logOfBeforePPUndo[dialogIndex].strokes.forEach(stroke => {
    //   const newStroke = new Stroke(
    //     stroke.points.map(point => new Point(point.x, point.y, {z: point.z})),
    //     {
    //       color: (stroke.color.length == 9 && stroke.color.slice(-2) !== "00")? stroke.color.slice(0, -2): stroke.color,
    //       strokeWidth: stroke.strokeWidth,
    //     }
    //   );
    //   newStroke.DFT.pointsToDraw();
    //   drawer.currentFigure.add(newStroke);
    //   setAddAvgPressureOfStroke(stroke.strokeAvgPressure)
    // });

    fabricDrawer?.setNewStrokes(logOfBeforePPUndo[dialogIndex].strokes);
    // fabricDrawer?.reDraw();
    // drawer.numOfStroke = drawer.currentFigure.strokes.length;
    // drawer.reDraw();
    // setClearUndoStrokeLog();
    // setUndoableCount(0);
    setSliderValue(logOfBeforePPUndo[dialogIndex].sliderValue!);
    // setLogRedoCount(logRedoCount + 1);
    // const afterLogRedoNoteImage: string = await drawer.getBase64PngImage().catch((error: unknown) => {
    //   console.log(error);
    // });
    // const afterLogRedoStrokeData = await getCurrentStrokeData(drawer.currentFigure.strokes);
    // const afterLogRedoStrokeCount = calcIsShowStrokeCount(drawer.currentFigure.strokes);
    // const postLogRedoCountData: PostLogRedoCountsDataType = {
    //   UID: myNote?.UID? myNote?.UID: 0,
    //   NID: myNote?.ID? myNote?.ID: 0,
    //   BeforeLogRedoNoteImage: beforeLogRedoNoteImage,
    //   BeforeLogRedoStrokeData: beforeLogRedoStrokeData,
    //   AfterLogRedoNoteImage: afterLogRedoNoteImage,
    //   AfterLogRedoStrokeData: afterLogRedoStrokeData,
    //   BeforeLogRedoStrokeCount: beforeLogRedoStrokeCount,
    //   AfterLogRedoStrokeCount: afterLogRedoStrokeCount,
    // };
    // await addLogRedoCount(postLogRedoCountData);
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