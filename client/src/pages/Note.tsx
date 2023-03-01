import React, { useState, useEffect, PointerEvent } from "react";
import { NoteSizeType, Point2Type } from "@/@types/note";
import { Drawer, Figure, Stroke } from "@nkmr-lab/average-figure-drawer";
import { DrawerConfig } from "@/configs/DrawerConfig";
import { NoteHeader } from "@/components/note/header";
import {
  Box 
} from "@mui/material";
import { useAtom } from 'jotai'
import { addAvgPressureOfStrokeAtom, avgPressureOfStrokeAtom, clearUndoStrokeLogAtom, drawModeAtom, drawerAtom, drawerNumOfStrokeAtom, removeAvgPressureOfStrokeAtom, setUndoStrokeLogAtom } from "@/infrastructures/jotai/drawer";
import { sum } from "@/modules/note/SumPressure";
import { NoteGraphAreas } from "@/components/note/graphAreas";

export const Note:React.FC =() => {
  const [noteSize, setNoteSize] = useState<NoteSizeType>({width: "70%", height: "800px"}); // ノートサイズ(svgのサイズ)
  const [isDraw, setIsDraw] = useState<boolean>(false); // 書いているかどうか
  const [drawMode, ] = useAtom(drawModeAtom); // penか消しゴムか
  const [drawer, setDrawer] = useAtom(drawerAtom); // drawerの情報
  const [, setAddAvgPressureOfStroke] = useAtom(addAvgPressureOfStrokeAtom); // ストロークの平均筆圧を追加する関数
  const [, setNumOfStroke] = useAtom(drawerNumOfStrokeAtom); // ストローク数の変更 FIXME: 他の配列の長さとかで取得できるだろうしdrawer内にもあるからそのうち削除
  const [, clearUndoStrokeLog] = useAtom(clearUndoStrokeLogAtom); // undoしたストロークのログを空に（redo不可状態に）
  const [, addLog] = useAtom(setUndoStrokeLogAtom); // undoしたストロークのログの追加
  const [, removeAvgPressureOfStroke] = useAtom(removeAvgPressureOfStrokeAtom); // ストロークの平均筆圧を削除(消しゴム時やundo時)
  const [avgPressureOfStroke, ] = useAtom(avgPressureOfStrokeAtom); // ストロークの筆圧平均のリストの取得
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

  const finishDraw = (e: PointerEvent<SVGSVGElement>) => {
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
        const averagePressure = e.pointerType=="mouse"? Math.random() :sumPressure / countPoints;
        setDrawer(drawer);
        setNumOfStroke(drawer.numOfStroke);
        clearUndoStrokeLog();
        setIsDraw(false);
        console.log(strokePressureList)
        console.log(averagePressure);
        console.log(drawer);
        setAddAvgPressureOfStroke(averagePressure);
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
          const toleranceRange = drawer.strokeWidth < 10? drawer.strokeWidth + 3: drawer.strokeWidth;
          if (Math.abs(pointX - offsetXAbout) < toleranceRange) {
            const pointY = Math.round(point2.y);
            if (Math.abs(pointY - offsetYAbout) < toleranceRange) {
              console.log("クロス！！")
              console.log(drawer.currentFigure.strokes[i]);
              addLog({
                stroke: drawer.currentFigure.strokes[i],
                pressure: avgPressureOfStroke[i]
              });
              removeAvgPressureOfStroke(i);
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
    <Box className="width100">
      <NoteHeader />
      <Box sx={{ display: "flex" }} className="width100">
        <Box className="canvasWrapper" id="canvasWrapper" sx={{ width: noteSize['width'], height: noteSize["height"], position: "relative" }}>
          <svg
            id="drawer"
            className="canvas"
            style={{ width: `${document.getElementById('canvasWrapper') && document.getElementById('canvasWrapper')!.clientWidth}px`, height: noteSize["height"] }}
            onPointerDownCapture={startDraw}
            onPointerMoveCapture={moveDraw}
            onPointerUpCapture={finishDraw}
          ></svg>
          {drawMode == "strokeErase" &&
            <svg
              id="erase-drawer"
              className="canvas"
              style={{ width: `${document.getElementById('canvasWrapper') && document.getElementById('canvasWrapper')!.clientWidth}px`, height: noteSize["height"] }}
              onPointerDownCapture={startEraseDraw}
              onPointerMoveCapture={eraseDraw}
              onPointerUpCapture={finishEraseDraw}
            ></svg>
          }
        </Box>
        <NoteGraphAreas />
      </Box>
    </Box>
  );
}