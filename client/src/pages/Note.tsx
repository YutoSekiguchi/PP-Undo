import React, { useState, useEffect, PointerEvent } from "react";
import { NoteSizeType, Point2Type } from "@/@types/note";
import { Drawer, Figure, Stroke } from "@nkmr-lab/average-figure-drawer";
import { DrawerConfig } from "@/configs/DrawerConfig";
import { NoteHeader } from "@/components/note/header";
import {
  Box 
} from "@mui/material";
import { useAtom } from 'jotai'
import { clearUndoStrokeLogAtom, drawModeAtom, drawerAtom, drawerNumOfStrokeAtom, setUndoStrokeLogAtom } from "@/infrastructures/jotai/drawer";
import { sum } from "@/modules/note/SumPressure";

export const Note:React.FC =() => {
  const [noteSize, setNoteSize] = useState<NoteSizeType>({width: "100%", height: "800px"});
  const [isDraw, setIsDraw] = useState<boolean>(false);
  const [drawMode, ] = useAtom(drawModeAtom);
  const [drawer, setDrawer] = useAtom(drawerAtom);
  const [, setNumOfStroke] = useAtom(drawerNumOfStrokeAtom);
  const [, clearUndoStrokeLog] = useAtom(clearUndoStrokeLogAtom);
  const [, addLog] = useAtom(setUndoStrokeLogAtom);
  let strokePressureList: number[] = [];
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
    strokePressureList = [];
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
    strokePressureList.push(e.pressure);
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
          strokePressureList = [];
          countPoints = 0;
          return;
        }
        const sumPressure = sum(strokePressureList);
        const averagePressure = sumPressure / countPoints;
        setDrawer(drawer);
        setNumOfStroke(drawer.numOfStroke);
        clearUndoStrokeLog();
        setIsDraw(false);
        console.log(strokePressureList)
        console.log(averagePressure);
        console.log(drawer.currentFigure);
        strokePressureList = [];
        countPoints = 0;
      } catch (error) {
        drawError(error);
      }
    }, 10);
  }

  const startEraseDraw = () => {
    setIsDraw(true);
  }

  const eraseDraw = (e: PointerEvent<SVGSVGElement>) => {
    if (!isDraw) { return; }
    if (drawMode == "strokeErase") {
      console.log(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
      const offsetXAbout = Math.round(e.nativeEvent.offsetX);
      const offsetYAbout = Math.round(e.nativeEvent.offsetY);
      drawer.currentFigure.strokes.map((stroke: any, i: number) => {
        stroke.points.map((point2: Point2Type, j: number) => {
          const pointX = Math.round(point2.x);
          if (Math.abs(pointX - offsetXAbout) < 10) {
            const pointY = Math.round(point2.y);
            if (Math.abs(pointY - offsetYAbout) < 10) {
              console.log("クロス！！")
              console.log(drawer.currentFigure.strokes[i]);
              addLog(drawer.currentFigure.strokes[i]);
              drawer.numOfStroke -= 1;
              drawer.currentFigure.strokes.splice(i, 1);
              setDrawer(drawer);
              setNumOfStroke(drawer.numOfStroke);
              drawer.reDraw();
            }
          }
        })
      })
    }
  }

  const finishEraseDraw = () => {
    setIsDraw(false);
  }

  return (
    <Box sx={{ width: "100%" }}>
      <NoteHeader />
      <Box className="canvasWrapper" sx={{ width: noteSize['width'], height: noteSize["height"], position: "relative" }}>
        <svg
          id="drawer"
          className="canvas"
          style={{ width: noteSize["width"], height: noteSize["height"] }}
          onPointerDownCapture={startDraw}
          onPointerMoveCapture={moveDraw}
          onPointerUpCapture={finishDraw}
        ></svg>
        {drawMode == "strokeErase" &&
          <svg
            id="erase-drawer"
            className="canvas"
            style={{ width: noteSize["width"], height: noteSize["height"] }}
            onPointerDownCapture={startEraseDraw}
            onPointerMoveCapture={eraseDraw}
            onPointerUpCapture={finishEraseDraw}
          ></svg>
        }
      </Box>
    </Box>
  );
}