import React, { useState, useEffect, PointerEvent } from "react";
import { NoteSizeType } from "@/@types/note";
import { Drawer, Figure, Stroke } from "@nkmr-lab/average-figure-drawer";
import { DrawerConfig } from "@/configs/DrawerConfig";
import { NoteHeader } from "@/components/note/header";
import {
  Box 
} from "@mui/material";
import { useAtom } from 'jotai'
import { clearUndoStrokeLogAtom, drawerAtom, drawerNumOfStrokeAtom } from "@/infrastructures/jotai/drawer";

export const Note:React.FC =() => {
  const [noteSize, setNoteSize] = useState<NoteSizeType>({width: "100%", height: "800px"});
  const [isDraw, setIsDraw] = useState<boolean>(false);
  const [drawer, setDrawer] = useAtom(drawerAtom);
  const [, setNumOfStroke] = useAtom(drawerNumOfStrokeAtom);
  const [, clearUndoStrokeLog] = useAtom(clearUndoStrokeLogAtom);
  let sumPressure: number = 0;
  let countPoints: number = 0;

  const drawers: any = {};

  useEffect(() => {
    // Drawerの設定
    if (drawers["drawer"] == undefined) {
      drawers["drawer"] = new Drawer("#drawer", DrawerConfig);
      setDrawer(drawers["drawer"])
    }
  }, []);

  const drawError = (error: unknown) => {
    alert("予期せぬエラーが発生したため，全てのストロークが削除されます。");
    drawer.clear();
    setDrawer(drawer);
    setNumOfStroke(0);
    setIsDraw(false);
    sumPressure = 0;
    countPoints = 0;
    throw error;
  }

  const startDraw = () => {
    setIsDraw(true);
  }

  const moveDraw = (e: PointerEvent<SVGSVGElement>) => {
    if (!isDraw || e.pressure == 0) {
      return;
    }
    sumPressure += e.pressure;
    countPoints += 1;
  }

  const finishDraw = () => {
    setTimeout(() => {
      try {
        const finalStroke = drawer.currentFigure.strokes[drawer.currentFigure.strokes.length-1];
        if ("svg" in finalStroke == false || finalStroke.svg == null) {
          drawer.currentFigure.strokes.pop();
          drawer.numOfStroke -= 1;
          setDrawer(drawer);
          setIsDraw(false);
          sumPressure = 0;
          countPoints = 0;
          return;
        }
        const averagePressure = sumPressure / countPoints;
        setDrawer(drawer);
        setNumOfStroke(drawer.numOfStroke);
        clearUndoStrokeLog();
        setIsDraw(false);
        console.log(sumPressure);
        console.log(countPoints);
        console.log(averagePressure);
        sumPressure = 0;
        countPoints = 0;
      } catch (error) {
        drawError(error);
      }
    }, 10);
  }

  return (
    <Box sx={{ width: "100%" }}>
      <NoteHeader />
      <Box className="canvasWrapper" sx={{ width: noteSize['width'], height: noteSize["height"] }}>
        <svg
          id="drawer"
          className="canvas"
          style={{ width: noteSize["width"], height: noteSize["height"] }}
          onPointerDownCapture={startDraw}
          onPointerMoveCapture={moveDraw}
          onPointerUpCapture={finishDraw}
        ></svg>
      </Box>
    </Box>
  );
}