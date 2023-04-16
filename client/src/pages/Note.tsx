import React, { useState, useEffect, PointerEvent } from "react";
import { NoteSizeType, Point2Type } from "@/@types/note";
import { Drawer, Point, Stroke } from "@nkmr-lab/average-figure-drawer";
import { DrawerConfig } from "@/configs/DrawerConfig";
import { NoteHeader } from "@/components/note/header";
import {
  Box, Button 
} from "@mui/material";
import { useAtom } from 'jotai'
import { addAvgPressureOfStrokeAtom, avgPressureOfStrokeAtom, clearUndoStrokeLogAtom, drawModeAtom, drawerAtom, undoableCountAtom, removeAvgPressureOfStrokeAtom, setUndoStrokeLogAtom, addPressureOfOneStrokeAtom, clearPressureOfOneStrokeAtom, undoCountAtom, redoCountAtom, logRedoCountAtom, ppUndoCountAtom, allStrokeCountAtom, allAvgPressureOfStrokeAtom, sliderValueAtom } from "@/infrastructures/jotai/drawer";
import { sum } from "@/modules/note/SumPressure";
import { NoteGraphAreas } from "@/components/note/graphAreas";
import { userDataAtom } from "@/infrastructures/jotai/authentication";
import { isAuth } from "@/modules/common/isAuth";
import { Params, useParams } from "react-router-dom";
import { fetchNoteByID, updateNote } from "@/infrastructures/services/note";
import { myNoteAtom } from "@/infrastructures/jotai/notes";
import { NoteDataType } from "@/@types/notefolders";
import { confirmNumberArrayFromString } from "@/modules/common/confirmArrayFromString";
import { averagePressure } from "@/modules/note/AveragePressure";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { TimeoutScreen } from "@/components/common/TimeoutScreen";
import { calcIsShowStrokeList } from "@/modules/note/CalcIsShowStrokeList";

export const Note:React.FC =() => {
  const params: Params<string> = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [noteSize, setNoteSize] = useState<NoteSizeType>({width: "70%", height: "1000px"}); // ノートサイズ(svgのサイズ)
  const [isDraw, setIsDraw] = useState<boolean>(false); // 書いているかどうか
  const [myNote, setMyNote] = useAtom(myNoteAtom); // ノート情報の保持
  const [drawMode, ] = useAtom(drawModeAtom); // penか消しゴムか
  const [drawer, setDrawer] = useAtom(drawerAtom); // drawerの情報
  const [, setAddAvgPressureOfStroke] = useAtom(addAvgPressureOfStrokeAtom); // ストロークの平均筆圧を追加する関数
  const [undoableCount, setUndoableCount] = useAtom(undoableCountAtom); // ストローク数の変更
  const [, clearUndoStrokeLog] = useAtom(clearUndoStrokeLogAtom); // undoしたストロークのログを空に（redo不可状態に）
  const [, addLog] = useAtom(setUndoStrokeLogAtom); // undoしたストロークのログの追加
  const [, removeAvgPressureOfStroke] = useAtom(removeAvgPressureOfStrokeAtom); // ストロークの平均筆圧を削除(消しゴム時やundo時)
  const [avgPressureOfStroke, setAvgPressureOfStroke] = useAtom(avgPressureOfStrokeAtom); // ストロークの筆圧平均のリストの取得
  const [allAvgPressureOfStroke, setAllAvgPressureOfStroke] = useAtom(allAvgPressureOfStrokeAtom); // ストロークの筆圧平均のリストの取得（過去全てのストロークについて）
  const [sliderValue, setSliderValue] = useAtom(sliderValueAtom);
  const [, addPressureOfOneStroke] = useAtom(addPressureOfOneStrokeAtom);
  const [, clearPressureOfOneStroke] = useAtom(clearPressureOfOneStrokeAtom);
  const [undoCount, setUndoCount] = useAtom(undoCountAtom);
  const [redoCount, setRedoCount] = useAtom(redoCountAtom);
  const [logRedoCount, setLogRedoCount] = useAtom(logRedoCountAtom);
  const [ppUndoCount, setPPUndoCount] = useAtom(ppUndoCountAtom);
  
  const [loginUserData, ] = useAtom(userDataAtom);
  let strokePressureList: number[] = [];
  let countPoints: number = 0;
  const drawers: any = {};

  const getFirstStrokeData = async () => {
    const data: NoteDataType | null = await fetchNoteByID(Number(params.id));
    setMyNote(data);
    return data
  }

  useEffect(() => {
    // Drawerの設定
    const main = async () => {
      if (drawers["drawer"] == undefined) {
        const noteData: NoteDataType | null = await getFirstStrokeData();
        drawers["drawer"] = new Drawer("#drawer", DrawerConfig);
        if (noteData == null || noteData.StrokeData.strokes == null) {
          setDrawer(drawers["drawer"]);
          finishLoading(1000);
          return;
        }
        adaptionResponseStrokeData(noteData);
        adaptionResponseAvgPressureList(noteData);
        adaptionResponseAllAvgPressureList(noteData);
        adaptionResponseSliderValue(noteData);
        drawers["drawer"].numOfStroke = drawers["drawer"].currentFigure.strokes.length;
        drawers["drawer"].reDraw();
        setDrawer(drawers["drawer"])
        reseDataCount();
        console.log(drawer)
      }
      finishLoading(2000);
    }
    
    main();
  }, []);

  const finishLoading = (time: number) => {
    setTimeout(() => {
      setIsLoading(false);
    }, time);
  }

  const reseDataCount = () => {
    setUndoCount(0);
    setRedoCount(0);
    setLogRedoCount(0);
    setPPUndoCount(0);
  }

  const drawError = (error: unknown) => {
    alert("予期せぬエラーが発生したため，全てのストロークが削除されます。");
    drawer.clear();
    setDrawer(drawer);
    setUndoableCount(0);
    setIsDraw(false);
    strokePressureList = [];
    countPoints = 0;
    throw error;
  }

  const startDraw = () => {
    clearPressureOfOneStroke();
    setIsDraw(true);
  }

  const moveDraw = (e: PointerEvent<SVGSVGElement>) => {
    if (!isDraw || e.pressure == 0) {
      return;
    }
    strokePressureList.push(e.pressure);
    const roundStrokePressure =  e.pointerType=="mouse"? Math.random(): Math.round(e.pressure * 100) / 100;
    addPressureOfOneStroke(roundStrokePressure);
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
        setUndoableCount(undoableCount+1);
        clearUndoStrokeLog();
        setIsDraw(false);
        console.log(strokePressureList)
        console.log(averagePressure);
        console.log(drawer);
        setAddAvgPressureOfStroke(averagePressure);
        strokePressureList = [];
        countPoints = 0;
        if (myNote != null) {
          myNote.StrokeData = drawer.currentFigure.strokes;
        }
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
              setUndoableCount(undoableCount+1);
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

  const makeRequestData = async () => {
    await adaptionRequestNoteImage();
    await adaptionRequestStrokeData();
    myNote!.AvgPressure = averagePressure(avgPressureOfStroke);
    adaptionRequestAvgPressureList();
    adaptionRequestAllAvgPressureList();
    adaptionRequestIsShowStrokeList();
    myNote!.AllStrokeCount += allAvgPressureOfStroke.length;
    myNote!.StrokeCount = avgPressureOfStroke.length;
    myNote!.UndoCount += undoCount;
    myNote!.RedoCount += redoCount;
    myNote!.LogRedoCount += logRedoCount;
    myNote!.PPUndoCount += ppUndoCount;
    myNote!.SliderValue = sliderValue;
  } 

  const adaptionRequestNoteImage  = async () => {
    const image: string = await drawer.getBase64PngImage().catch((error: unknown) => {
      console.log(error);
    });
    myNote!.NoteImage = image? image: "";
  }

  const adaptionRequestStrokeData = async () => {
    const tmp: any[] = [];
    await myNote?.StrokeData.map((stroke: any, i: number) => {
      stroke.svg = "";
      stroke.DFT = "";
      stroke.spline = "";
      tmp.push(stroke);
    });
    myNote!.StrokeData = {"Strokes": tmp};
  }

  const adaptionResponseStrokeData = (noteData: NoteDataType | null) => {
    drawers["drawer"].currentFigure.strokes = [];
    noteData!.StrokeData.strokes.forEach((stroke: any) => {
      const newStroke = new Stroke(
        stroke.points.map((point: any) => new Point(point.x, point.y, {z: point.z})),
        {
          color: stroke.color,
          strokeWidth: stroke.strokeWidth,
        }
      );
      newStroke.DFT.pointsToDraw();
      drawers["drawer"].currentFigure.add(newStroke);
    });
  }

  const adaptionRequestAvgPressureList = () => {
    myNote!.AvgPressureList = avgPressureOfStroke.join(',');
  }

  const adaptionResponseAvgPressureList = (noteData: NoteDataType | null) => {
    if (noteData!.AvgPressureList === "") {
      setAvgPressureOfStroke([]);
      return;
    }
    const newData = confirmNumberArrayFromString(noteData!.AvgPressureList);
    setAvgPressureOfStroke(newData);
  }

  const adaptionRequestAllAvgPressureList = () => {
    myNote!.AllAvgPressureList = allAvgPressureOfStroke.join(',');
  }

  const adaptionResponseAllAvgPressureList = (noteData: NoteDataType | null) => {
    if (noteData!.AllAvgPressureList === "") {
      setAllAvgPressureOfStroke([]);
      return;
    }
    const newData = confirmNumberArrayFromString(noteData!.AllAvgPressureList);
    setAllAvgPressureOfStroke(newData);
  }

  const adaptionRequestIsShowStrokeList = () => {
    const showStrokeList = calcIsShowStrokeList(drawer.currentFigure.strokes);
    myNote!.IsShowStrokeList = showStrokeList.join(',');
  }

  const adaptionResponseSliderValue = (noteData: NoteDataType | null) => {
    setSliderValue(noteData!.SliderValue);
  }

  const save = async() => {
    await makeRequestData();
    console.log(myNote);
    await updateNote(myNote!);
    console.log("保存しました");
  }

  const test = () => {
    console.log(sliderValue)
    console.log(myNote);
    console.log(avgPressureOfStroke)
  }

  return (
    <>
      {
        (isAuth() && isLoading)&& <LoadingScreen /> 
      }
      {
        isAuth() || loginUserData != null ?
        <Box className="width100 note">
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
          <Button onClick={save}>Save</Button>
          <Button onClick={test}>TEST(出力チェック)</Button>
        </Box>
        :
        <>
          <TimeoutScreen />
        </>
      }
    </>
  );
}