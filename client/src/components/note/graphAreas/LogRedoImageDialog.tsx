import React from "react";
import { LogRedoImageDialogProps } from "@/@types/note";
import { useAtom } from "jotai";
import { Stroke, Point } from "@nkmr-lab/average-figure-drawer";
import { addAvgPressureOfStrokeAtom, clearAvgPressureOfStrokeAtom, clearUndoStrokeLogAtom, drawerAtom, logOfBeforePPUndoAtom, undoableCountAtom } from "@/infrastructures/jotai/drawer";
import { Box, Button } from "@mui/material";
import { CancelButton } from "./CancelButton";


export const LogRedoImageDialog: React.FC<LogRedoImageDialogProps> = (props) => {
  const { dialogIndex, closeDialog, closeLog } = props;
  const [drawer, ] = useAtom(drawerAtom);
  const [logOfBeforePPUndo, ] = useAtom(logOfBeforePPUndoAtom);
  const [, setClearAvgPressureOfStroke] = useAtom(clearAvgPressureOfStrokeAtom);
  const [, setAddAvgPressureOfStroke] = useAtom(addAvgPressureOfStrokeAtom);
  const [, setClearUndoStrokeLog] = useAtom(clearUndoStrokeLogAtom);
  const [, setUndoableCount] = useAtom(undoableCountAtom);

  const ppRedo = () => {
    setClearAvgPressureOfStroke();
    const numOfStroke = drawer.numOfStroke;
    if(numOfStroke <= 0) return
    drawer.currentFigure.strokes = []
    logOfBeforePPUndo[dialogIndex].strokes.forEach(stroke => {
      const newStroke = new Stroke(
        stroke.points.map(point => new Point(point.x, point.y, {z: point.z})),
        {
          color: stroke.color,
          strokeWidth: stroke.strokeWidth,
        }
      );
      newStroke.DFT.pointsToDraw();
      drawer.currentFigure.add(newStroke);
      setAddAvgPressureOfStroke(stroke.strokeAvgPressure)
    });
    drawer.numOfStroke = drawer.currentFigure.strokes.length;
    drawer.reDraw();
    setClearUndoStrokeLog();
    setUndoableCount(0);
    closeDialog();
    closeLog();
  }

  return (
    <Box className="dialog-image-container">
      <CancelButton
        close={closeDialog}
      />
      <Box className="width100 dialog-image-wrapper">
        <Box className="width100">
        <img className="dialog-image" src={logOfBeforePPUndo[dialogIndex].image}></img>
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