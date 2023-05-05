import React, { useState, useEffect, PointerEvent } from "react";
import { ClientLogDataType, NoteSizeType, Point2Type, PostStrokeDataType } from "@/@types/note";
import { Drawer, Point, Stroke } from "@nkmr-lab/average-figure-drawer";
import { DrawerConfig } from "@/configs/DrawerConfig";
import { NoteHeader } from "@/components/note/header";
import {
  Box, Button 
} from "@mui/material";
import { useAtom } from 'jotai'
import { addAvgPressureOfStrokeAtom, avgPressureOfStrokeAtom, clearUndoStrokeLogAtom, drawModeAtom, drawerAtom, undoableCountAtom, removeAvgPressureOfStrokeAtom, setUndoStrokeLogAtom, addPressureOfOneStrokeAtom, clearPressureOfOneStrokeAtom, undoCountAtom, redoCountAtom, logRedoCountAtom, ppUndoCountAtom, allAvgPressureOfStrokeAtom, sliderValueAtom, logOfBeforePPUndoAtom } from "@/infrastructures/jotai/drawer";
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
import { calcIsShowStrokeList } from "@/modules/note/CalcIsShowStroke";
import { addStroke } from "@/infrastructures/services/strokes";
import { fetchClientLogsByNID } from "@/infrastructures/services/ppUndoLogs";
import { getCurrentStrokeData } from "@/modules/note/GetCurrentStrokeData";
import { distanceFromPointToLine } from "@/modules/note/DistanceFromPointToLine";

let drawStartTime: number = 0; // 描画時の時刻
let drawEndTime: number = 0; // 描画終了時の時刻

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
  const [, setLogOfBeforePPUndo] = useAtom(logOfBeforePPUndoAtom);
  const [undoCount, setUndoCount] = useAtom(undoCountAtom);
  const [redoCount, setRedoCount] = useAtom(redoCountAtom);
  const [logRedoCount, setLogRedoCount] = useAtom(logRedoCountAtom);
  const [ppUndoCount, setPPUndoCount] = useAtom(ppUndoCountAtom);
  const [prevOffset, setPrevOffset] = useState<{x: number, y: number} | null>(null);
  
  const [loginUserData, ] = useAtom(userDataAtom);
  let strokePressureList: number[] = [];
  let countPoints: number = 0;
  let erasePressureList: number[] = [];
  let countErasePoints: number = 0;
  const drawers: any = {};
  const firstColor = "#000000"
  
  const getFirstStrokeData = async () => {
    const data: NoteDataType | null = await fetchNoteByID(Number(params.id));
    const clientLogData: ClientLogDataType[] | null = await fetchClientLogsByNID(Number(params.id))
    setMyNote(data);
    const tmp: any[] = [];
    clientLogData?.map((clientLog: ClientLogDataType, i: number) => {
      tmp.push(clientLog.Data);
    });
    setLogOfBeforePPUndo(tmp);
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
          resetAllData();
          finishLoading(1000);
          return;
        }
        adaptionResponseStrokeData(noteData);
        adaptionResponseAvgPressureList(noteData);
        adaptionResponseAllAvgPressureList(noteData);
        adaptionResponseSliderValue(noteData);
        drawers["drawer"].numOfStroke = drawers["drawer"].currentFigure.strokes.length;
        drawers["drawer"].config.colors.originalPoint = firstColor;
        drawers["drawer"].config.colors.dft = firstColor;
        drawers["drawer"].setStrokeColor(firstColor);
        drawers["drawer"].reDraw();
        setDrawer(drawers["drawer"])
        resetDataCount();
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

  const resetDataCount = () => {
    setUndoCount(0);
    setRedoCount(0);
    setLogRedoCount(0);
    setPPUndoCount(0);
  }

  const resetAllData = () => {
    setSliderValue(0);
    setAvgPressureOfStroke([]);
    setAllAvgPressureOfStroke([]);
    setLogOfBeforePPUndo([]);
    resetDataCount();
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
    drawStartTime = performance.now();
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

  const finishDraw = async (e: PointerEvent<SVGSVGElement>) => {
    drawEndTime = performance.now();
    
    setTimeout(async() => {
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
        console.log(drawer);
        setAddAvgPressureOfStroke(averagePressure);
        countPoints = 0;
        if (myNote != null) {
          myNote.StrokeData = drawer.currentFigure.strokes.concat();
        }
        // ストロークデータを取得してAPIに送信
        const requestStrokeData = await adaptionRequestStrokeData();
        const postStrokeData: PostStrokeDataType = {
          UID: myNote!.UID,
          NID: myNote!.ID,
          StrokeData: requestStrokeData,
          AvgPressure: averagePressure,
          PressureList: strokePressureList.join(','),
          Time: drawEndTime - drawStartTime,
          Mode: "pen",
          Save: 0,
        }
        await addStroke(postStrokeData);
        console.log(postStrokeData);
        console.log(drawEndTime);
        console.log(drawStartTime);
        strokePressureList = [];
      } catch (error) {
        drawError(error);
      }
        // drawer.reDraw();
    }, 100);
  }

  const startEraseDraw = () => {
    drawStartTime = performance.now();
    setIsDraw(true);
  }

  const eraseDraw = (e: PointerEvent<SVGSVGElement>) => {
    if (!isDraw) { return; }
    erasePressureList.push(e.pressure);
    countErasePoints += 1;
    if (drawMode == "strokeErase") {
      const offsetXAbout = Math.round(e.nativeEvent.offsetX);
      const offsetYAbout = Math.round(e.nativeEvent.offsetY);
      drawer.currentFigure.strokes.map((stroke: any, i: number) => {
        let isErase = false;
        if (stroke.color.length != 9) {
          for(let j=0; j < stroke.DFT.points.length; j++) {
            if (isErase) {break}
            const point2: Point2Type = stroke.DFT.points[j];
            const pointX = Math.round(point2.x);
            const pointY = Math.round(point2.y);
            const toleranceRange = 6;
            if (prevOffset == null) {
              if (Math.abs(pointX - offsetXAbout) < toleranceRange) {
                if (Math.abs(pointY - offsetYAbout) < toleranceRange) {
                  removeStroke(i);
                  isErase = true;
                }
              }
            } else {
              const distance = distanceFromPointToLine(pointX, pointY, offsetXAbout, offsetYAbout, prevOffset.x, prevOffset.y);
              setPrevOffset({"x": offsetXAbout, "y": offsetYAbout})
              if (distance < toleranceRange) {
                removeStroke(i);
                isErase = true;
              }
            }
          }
        }
      })
    }
  }

  const removeStroke = (i: number) => {
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

  const finishEraseDraw = async() => {
    drawEndTime = performance.now();
    const sumPressure = sum(erasePressureList);
    const averagePressure = sumPressure / countErasePoints;
    // 消しゴムストロークデータを取得してAPIに送信
    const requestStrokeData = await adaptionRequestStrokeData();
    const postStrokeData: PostStrokeDataType = {
      UID: myNote!.UID,
      NID: myNote!.ID,
      StrokeData: requestStrokeData,
      AvgPressure: averagePressure,
      PressureList: erasePressureList.join(','),
      Time: drawEndTime - drawStartTime,
      Mode: "erase",
      Save: 0,
    }
    await addStroke(postStrokeData);
    countErasePoints = 0;
    setIsDraw(false);
  }

  const makeRequestData = async () => {
    await adaptionRequestNoteImage();
    myNote!.StrokeData = await adaptionRequestStrokeData();
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
    const res = await getCurrentStrokeData(myNote?.StrokeData);
    return res;
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