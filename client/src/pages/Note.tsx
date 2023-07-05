import { useState, useEffect, PointerEvent } from "react";
import { useAtom } from 'jotai';
import { fabric } from "fabric";
import lscache from "lscache";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { FabricDrawer } from "@/modules/fabricdrawer";
import { Box } from "@mui/material";
import { isAuth } from "@/modules/common/isAuth";
import { NoteGraphAreas } from "@/components/note/graphAreas";
import { getAveragePressure } from "@/modules/note/GetAveragePressure";
import { NewNoteHeader } from "@/components/note/header";
import { addAvgPressureOfStrokeAtom, addHistoryAtom, addHistoryGroupPressureAtom, avgPressureOfStrokeAtom, backgroundImageAtom, basisPressureAtom, drawModeAtom, historyForRedoAtom, isDemoAtom, logOfBeforePPUndoAtom, logRedoCountAtom, noteAspectRatiotAtom, nowPointPressureAtom, ppUndoCountAtom, redoCountAtom, resetAtom, undoCountAtom, waveCountAtom } from "@/infrastructures/jotai/drawer";
import { isLineSegmentIntersecting } from "@/modules/note/IsLineSegmentIntersecting";
import { getMinimumPoints } from "@/modules/note/GetMinimumPoints";
import NoteImg from "@/assets/notesolidb.svg"
import { Location, Params, useLocation, useNavigate, useParams } from "react-router-dom";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { myNoteAtom } from "@/infrastructures/jotai/notes";
import { fetchNoteByID, updateNote } from "@/infrastructures/services/note";
import { TNoteData } from "@/@types/notefolders";
import { TClientLogData, TPointDataList, TPostStrokeData } from "@/@types/note";
import { addStroke, updateTransformPressures } from "@/infrastructures/services/strokes";
import { fetchClientLogsByNID } from "@/infrastructures/services/ppUndoLogs";
import { BORDER_STRONG_PRESSURE, BORDER_WAVE_COUNT, BORDER_WAVE_PRESSURE, NOTE_WIDTH_RATIO, PRESSURE_ROUND_VALUE } from "@/configs/settings";
import { confirmNumberArrayFromString } from "@/modules/common/confirmArrayFromString";
import { rgbToHex } from "@/modules/note/RGBToHex";

let drawStartTime: number = 0; // 描画時の時刻
let drawEndTime: number = 0; // 描画終了時の時刻
let basePressure: number = 0;
let strokePressureList: number[] = [];
let scrollTop = 0;
let pointDataList: TPointDataList[] = [];
let isIncreasing: -1 | 0 | 1 = 0;

export const Note: () => JSX.Element = () => {
  const { editor, onReady } = useFabricJSEditor();
  
  const navigate = useNavigate();
  const location: Location = useLocation();
  const params: Params<string> = useParams();
  const isDemo = (location.pathname.indexOf("/demo/")>-1 || location.pathname.indexOf("/demo")>-1);
  const [, setIsDemo] = useAtom(isDemoAtom)
  const [isReset, setIsReset] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDraw, setIsDraw] = useState<boolean>(false);
  const [prevOffset, setPrevOffset] = useState<{x: number, y: number} | null>(null);
  const [fabricDrawer, setFabricDrawer] = useState<FabricDrawer>();
  const [eraseStrokes, setEraseStrokes] = useState<any[]>([]);
  const [myNote, setMyNote] = useAtom(myNoteAtom);
  const [drawMode, ] = useAtom(drawModeAtom); // penか消しゴムか
  const [, addHistory] = useAtom(addHistoryAtom);
  const [, setHistoryForRedo] = useAtom(historyForRedoAtom);
  const [backgroundImage, setBackgroundImage] = useAtom(backgroundImageAtom);
  const [avgPressureOfStroke, setAvgPressureOfStroke] = useAtom(avgPressureOfStrokeAtom);
  const [, setAddAvgPressureOfStroke] = useAtom(addAvgPressureOfStrokeAtom);
  const [, setBasisPressure] = useAtom(basisPressureAtom);
  const [, setLogOfBeforePPUndo] = useAtom(logOfBeforePPUndoAtom);
  const [undoCount, ] = useAtom(undoCountAtom);
  const [redoCount, ] = useAtom(redoCountAtom);
  const [logRedoCount, ] = useAtom(logRedoCountAtom);
  const [ppUndoCount, ] = useAtom(ppUndoCountAtom);
  const [noteAspectRatio, setNoteAspectRatio] = useAtom(noteAspectRatiotAtom);
  const [, setReset] = useAtom(resetAtom);
  const [storePressureVal, setStorePressureVal] = useState<number>(0);
  const [, addHistoryGroupPressure] = useAtom(addHistoryGroupPressureAtom);
  const [, setNowPointPressure] = useAtom(nowPointPressureAtom);
  const [waveCount, setWaveCount] = useAtom(waveCountAtom);
  

  useEffect(() => {
    if (!editor || !fabric || !(fabricDrawer === undefined && !!editor)) {
      return;
    }

    const firstLoadData = async () => {
      if (!isReset) {
        setReset();
        setIsReset(true);
      }
      const noteData: TNoteData | null = await getFirstStrokeData();
      const instance = new FabricDrawer(editor);
      setFabricDrawer(instance);
      console.log(noteData);
      if (instance?.getStrokeLength() == 0) {
        if (noteData !== null) {
          instance?.setSVGFromString(noteData.StrokeData.strokes.svg);
          if (noteData.AllAvgPressureList !== "") {
            setAvgPressureOfStroke(confirmNumberArrayFromString(noteData.AllAvgPressureList));
          }
          for(let i=0; i<editor.canvas._objects.length; i++) {
            if (editor.canvas._objects[i].stroke!.slice(0, 3) === "rgb") {
              editor.canvas._objects[i].stroke = rgbToHex(editor.canvas._objects[i].stroke!)
            }
            Object.assign(editor.canvas._objects[i], { pressure: noteData.StrokeData.strokes.pressure[i] });
            Object.assign(editor.canvas._objects[i], { averagePressure: noteData.StrokeData.strokes.averagePressure[i] });
          }
        }
      }
      finishLoading(2500);
    }
    if (fabricDrawer === undefined && !!editor) {
      setIsDemo(isDemo);
      firstLoadData();
    }
    editor.canvas.renderAll();
  }, [editor, fabricDrawer]);

  useEffect(() => {
    if (!editor || !fabric) {
      return;
    }
    fabricDrawer?.setDrawingMode();
    fabricDrawer?.changeColor("#1f1f1f");
    fabricDrawer?.setCanvasSize(window.innerWidth * NOTE_WIDTH_RATIO, window.innerWidth * NOTE_WIDTH_RATIO * noteAspectRatio);
    setBackgroundImage(NoteImg);
    fabricDrawer?.reDraw();
  }, [fabricDrawer, backgroundImage]);

  useEffect(() => {
    const loadImage = (src: string) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
        img.src = src;
      });
    };
    
    // promise then/catch
    loadImage(NoteImg)
      .then((res: any) => {
        setNoteAspectRatio(res.height/res.width);
      })
      .catch(e => {
        console.log('onload error', e);
      });

    return () => {
      if (isLoading) {
        return;
      }
      // save();
    }
  }, [isLoading])
  
  useEffect(() => {
    if(drawMode === "strokeErase") {
      const body = document.getElementsByTagName('body')[0];
      scrollTop = window.scrollY;
      body.style.top = (scrollTop * -1) + 'px';
      body.classList.add('no_scroll');
    } else if (drawMode === "pen" && document.getElementsByTagName('body')[0].classList.contains("no_scroll")) {
      const body = document.getElementsByTagName('body')[0];
      body.style.top = '';
      body.classList.remove('no_scroll');
      window.scrollTo(0, scrollTop);
    }
  }, [drawMode])

  const getFirstStrokeData = async () => {
    if (isDemo) {
      return null;
    }
    const userData = lscache.get('loginUserData');
    const data: TNoteData | null = await fetchNoteByID(Number(params.id));
    if(data?.UID !== Number(userData.ID)) {
      navigate('/notefolders/0');
    }
    setMyNote(data);
    const clientLogData: TClientLogData[] | null = await fetchClientLogsByNID(Number(params.id))
    const tmp: any[] = [];
    clientLogData?.map((clientLog: TClientLogData, _: number) => {
      tmp.push(clientLog.Data);
    });
    setLogOfBeforePPUndo(tmp);
    return data
  }

  const finishLoading = (time: number) => {
    setTimeout(() => {
      setIsLoading(false);
    }, time);
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    // 前のストロークが要素をはみ出してしまっていた時の処理
    drawStartTime = Math.round(performance.now() * PRESSURE_ROUND_VALUE) / PRESSURE_ROUND_VALUE;
    const finalStroke: any = fabricDrawer?.getFinalStroke();
    if (finalStroke && typeof finalStroke.pressure === 'undefined') {
      // if (strokePressureList.length < BORDER_WAVE_COUNT) {
      //   fabricDrawer?.removeStroke(finalStroke!)
      // } else {
        const averagePressure: number = event.pointerType=="mouse"?Math.random(): getAveragePressure(strokePressureList);
        const resultPressure: number = event.pointerType=="mouse"?Math.random(): getAveragePressure(strokePressureList);
        fabricDrawer?.setAveragePressureToStroke(averagePressure);
        fabricDrawer?.setTransformPressureToStroke(resultPressure);
        addHistory({
          type: "pen",
          strokes: [finalStroke]
        })
        postStrokeData(resultPressure, resultPressure, strokePressureList);
      // }
    }
    //
    setHistoryForRedo([]);
    strokePressureList = [];
    pointDataList = [];
    setIsDraw(true);
  }

  const handlePointerMove = (event: any) => {
    if (!isDraw || event.pointerType === "touch") {return;}
    if (event.pressure !== 0) {
      strokePressureList = [...strokePressureList, Math.round(event.pressure*PRESSURE_ROUND_VALUE)/PRESSURE_ROUND_VALUE];
      let sum = 0;
      if (strokePressureList.length == 1) {
        basePressure = strokePressureList[0];
      } else {
        if (basePressure - strokePressureList[strokePressureList.length -1] >= BORDER_WAVE_PRESSURE && isIncreasing != 1) {
          basePressure = strokePressureList[strokePressureList.length -1]
          setWaveCount(waveCount + 1)
          isIncreasing = 1
        } else if (strokePressureList[strokePressureList.length -1] -basePressure >= BORDER_WAVE_PRESSURE && isIncreasing != -1) {
          basePressure = strokePressureList[strokePressureList.length -1]
          setWaveCount(waveCount + 1)
          isIncreasing = -1
        }
      }
      for (let i = 0; i < strokePressureList.length; i++) {
        sum += strokePressureList[i];
      }
      if (storePressureVal === 0) {
        setBasisPressure(event.pointerType=="mouse"
        ? Math.round(Math.random() * PRESSURE_ROUND_VALUE)/PRESSURE_ROUND_VALUE
        : Math.round(sum/strokePressureList.length*PRESSURE_ROUND_VALUE)/PRESSURE_ROUND_VALUE);
      }
      setNowPointPressure(Math.round(strokePressureList[strokePressureList.length - 1]*PRESSURE_ROUND_VALUE)/PRESSURE_ROUND_VALUE);
      const pointerX = Math.round(event.clientX*PRESSURE_ROUND_VALUE)/PRESSURE_ROUND_VALUE;
      const pointerY = Math.round((event.clientY - 65)*PRESSURE_ROUND_VALUE)/PRESSURE_ROUND_VALUE;
      const tiltX = Math.round(event.tiltX*PRESSURE_ROUND_VALUE)/PRESSURE_ROUND_VALUE;
      const tiltY = Math.round(event.tiltY*PRESSURE_ROUND_VALUE)/PRESSURE_ROUND_VALUE;
      const canvasWidth = event.target.clientWidth;
      const canvasHeight = event.target.clientHeight;
      const pointData = {
        "pointerX": pointerX,
        "pointerY": pointerY,
        "tiltX": tiltX,
        "tiltY": tiltY,
        "pressure": Math.round(event.pressure*PRESSURE_ROUND_VALUE)/PRESSURE_ROUND_VALUE,
        "time": Math.round(performance.now() * PRESSURE_ROUND_VALUE) / PRESSURE_ROUND_VALUE,
        "canvasWidth": canvasWidth,
        "canvasHeight": canvasHeight,
      }
      pointDataList = [...pointDataList, pointData]
    }
  }

  const handlePointerUp = async(event: PointerEvent<HTMLDivElement>) => {
    // if (event.pointerType === "touch") { return; }
    setIsDraw(false);
    setNowPointPressure(0);
    const averagePressure: number = event.pointerType=="mouse"?Math.round(Math.random() * PRESSURE_ROUND_VALUE)/PRESSURE_ROUND_VALUE: getAveragePressure(strokePressureList);
    const transformPressure: number = event.pointerType=="mouse"?averagePressure: getAveragePressure(strokePressureList);
    // if (strokePressureList.length < BORDER_FINISH_POINT && storePressureVal !== 0) {
    //   fabricDrawer?.isGrouping(true, storePressureVal);
    //   addHistoryGroupPressure(storePressureVal);
    //   if (!isDemo) {
    //     await updateTransformPressures(myNote!.ID, storePressureVal)
    //   }
    //   setStorePressureVal(0);
    //   setBasisPressure(0);
    // }
    
    if (!(storePressureVal !== 0 && averagePressure >= BORDER_STRONG_PRESSURE)) {
      if (storePressureVal === 0) {
        setStorePressureVal(averagePressure);
      } else if (isWave()) {
        setStorePressureVal(0);
        setBasisPressure(0);
      }
    }
      await postStrokeData(averagePressure, transformPressure, strokePressureList);
      
      setTimeout(() => {
        if (drawMode == "pen") {
          setAddAvgPressureOfStroke(averagePressure);
          const finalStroke = fabricDrawer?.getFinalStroke();
          if (finalStroke) {
            fabricDrawer?.setAveragePressureToStroke(averagePressure);
            fabricDrawer?.setTransformPressureToStroke(transformPressure);
            fabricDrawer?.setIsGrouping(false);
            addHistory({
              type: "pen",
              strokes: [finalStroke]
            })
          }
          // if (averagePressure >= 0.7) {
          //   fabricDrawer?.changeStrokesC("#ff0000");
          // } else if (averagePressure <= 0.25) {
          //   fabricDrawer?.changeStrokesC("#0000ff");
          // } else {
          //   fabricDrawer?.changeStrokesC("#00ff00");
          // }
          // if (waveCount >= 6) {
          //   fabricDrawer?.changeStrokesC("#ff00ff");
          // }
          fabricDrawer?.reDraw();
        }
        if (storePressureVal !== 0 && averagePressure >= BORDER_STRONG_PRESSURE && !isWave()) {
          fabricDrawer?.isGrouping(true, storePressureVal);
          addHistoryGroupPressure(storePressureVal);
          if (!isDemo) {
            updateTransformPressures(myNote!.ID, storePressureVal)
          }
          setStorePressureVal(0);
          setBasisPressure(0);
        }
      }, 100);
    setWaveCount(0)
  }

  const isWave = () => {
    basePressure = 0
    if (waveCount >= BORDER_WAVE_COUNT) {
      setWaveCount(0)
      return true;
    }
    setWaveCount(0);
    return false;
  }

  const postStrokeData = async (averagePressure: number, transformPressure: number, strokePressureList: number[]) => {
    // const regex = /<g\b[^>]*>(.*?)<\/g>/gs;
    // const lastStrokeSVG = fabricDrawer?.getSVG().match(regex)
    // console.log(lastStrokeSVG[lastStrokeSVG.length - 1])
    if(isDemo) {return;}
    drawEndTime = Math.round(performance.now() * PRESSURE_ROUND_VALUE) / PRESSURE_ROUND_VALUE;
    const data: TPostStrokeData = {
      UID: myNote!.UID,
      NID: myNote!.ID,
      StrokeData: {
        "Strokes": 
          {
            "pressure": fabricDrawer?.getAveragePressureList(),
            "svg": fabricDrawer?.getSVG(),
            // "svg": fabricDrawer?.getImg(),
            // "svg": "",
            "data": "",
          }
      },
      AvgPressure: averagePressure,
      PointDataList: {"data": pointDataList},
      TransformPressure: transformPressure,
      // PressureList: strokePressureList.join(','),
      PressureList: "",
      StartTime: drawStartTime,
      EndTime: drawEndTime,
      Time: drawEndTime - drawStartTime,
      Mode: drawMode,
      Save: 0,
    }
    await addStroke(data);
  }

  
  const handleEraseDown = (event: PointerEvent<HTMLCanvasElement>) => {
    // if (event.pointerType === "touch") {
    //   fabricDrawer?.setPointingMode();
    //   setIsPointer(false);
    //   return;
    // }
    // if (!isPointer) {
    //   fabricDrawer?.setDrawingMode();
    //   setIsPointer(true);
    // }
    drawStartTime = Math.round(performance.now() * PRESSURE_ROUND_VALUE) / PRESSURE_ROUND_VALUE;
    strokePressureList = [];
    setIsDraw(true);
  }

  const handleEraseMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!isDraw && drawMode === "strokeErase") { return; }
    // if (event.pointerType === "touch") { return; }
    strokePressureList = [...strokePressureList, event.pressure];
    const offsetXAbout = Math.round(event.nativeEvent.offsetX);
    const offsetYAbout = Math.round(event.nativeEvent.offsetY);
    const paths = fabricDrawer?.getObjectPaths();
    paths?.map((path: any, index: number) => {
      let isErase = false;
      const stroke = fabricDrawer?.getStroke(index);
      const minPoints = getMinimumPoints(path);
      const diffLeft = stroke?.left!==undefined
      ? Math.round(stroke.left - minPoints.left)
      : 0;
      const diffTop = stroke?.top!==undefined
      ? Math.round(stroke.top - minPoints.top)
      : 0;
      for(var j=0; j<path.length; j++) {
        if (isErase) {break}
        const points = path[j];
        if(points.length === 5) {
          const lastPoints = path[j-1];
          const prev2PointX = Math.round(lastPoints[3] + diffLeft), prev2PointY = Math.round(lastPoints[4] + diffTop);
          const prevPointX = Math.round(points[1] + diffLeft), prevPointY = Math.round(points[2] + diffTop);
          const pointX = Math.round(points[3] + diffLeft), pointY = Math.round(points[4] + diffTop);
          if (prevOffset !== null) {
            const isIntersectPrev = isLineSegmentIntersecting(
              prevOffset.x,
              prevOffset.y,
              offsetXAbout,
              offsetYAbout,
              prev2PointX,
              prev2PointY,
              prevPointX,
              prevPointY,
            );
            const isIntersect = isLineSegmentIntersecting(
              prevOffset.x,
              prevOffset.y,
              offsetXAbout,
              offsetYAbout,
              prevPointX,
              prevPointY,
              pointX,
              pointY,
            );
            if ((isIntersect || isIntersectPrev) && stroke) {
              fabricDrawer?.removeStroke(stroke);
              setEraseStrokes(eraseStrokes.concat([stroke]));
              isErase = true;
            }
          }
        }
      }
    })
    setPrevOffset({"x": offsetXAbout, "y": offsetYAbout});
  }
  
  const handleEraseUp = (event: PointerEvent<HTMLCanvasElement>) => {
    // if (event.pointerType === "touch") { return; }
    drawEndTime = Math.round(performance.now() * PRESSURE_ROUND_VALUE) / PRESSURE_ROUND_VALUE;
    setPrevOffset(null);
    setIsDraw(false);
    const averagePressure: number = event.pointerType=="mouse"?Math.random(): getAveragePressure(strokePressureList);
    const resultPressure: number = event.pointerType=="mouse"?Math.random(): getAveragePressure(strokePressureList);
    setTimeout(() => {
      if (eraseStrokes.length > 0) {
        addHistory({
          type: "erase",
          strokes: eraseStrokes
        })
      }
      postStrokeData(averagePressure, resultPressure, strokePressureList);
      setEraseStrokes([]);
    }, 100)
  }

  const save = async() => {
    if (isDemo) { return; }
    try {
      myNote!.NoteImage = fabricDrawer!.getImg();
      myNote!.StrokeData = {"Strokes": {"data": editor?.canvas.getObjects(), "pressure": fabricDrawer!.getAveragePressureList(), "svg": fabricDrawer?.getSVG()}};
      myNote!.AvgPressure = fabricDrawer!.getAveragePressure();
      myNote!.AvgPressureList = fabricDrawer!.getPressureListAsString();
      myNote!.AllAvgPressureList = avgPressureOfStroke.join(',');
      myNote!.AllStrokeCount = avgPressureOfStroke.length;
      myNote!.StrokeCount = fabricDrawer!.getStrokeLength();
      myNote!.UndoCount += undoCount;
      myNote!.RedoCount += redoCount;
      myNote!.LogRedoCount += logRedoCount;
      myNote!.PPUndoCount += ppUndoCount;
      myNote!.BackgroundImage = NoteImg;
      await updateNote(myNote!);
    } catch (error) {
      alert("保存に失敗しました");
      throw error;
    }
  }

  return (
    <>
    {
      ((isAuth() || isDemo) && isLoading)&& <LoadingScreen /> 
    }
    {
      isAuth() || isDemo?
      <Box className="width100 note">
        {
          fabricDrawer !== undefined &&
          <NewNoteHeader fabricDrawer={fabricDrawer} save={save} />
        }
        <Box sx={{ display: "flex" }} className="width100">
          <Box className="canvasWrapper" id="canvasWrapper" 
            sx={{ 
              width: window.innerWidth * NOTE_WIDTH_RATIO,
              height: window.innerWidth * NOTE_WIDTH_RATIO * noteAspectRatio,
              position: "relative" 
            }}
          >
            <Box
              className="fabric-canvas-wrapper"
              sx={{
                width: window.innerWidth * NOTE_WIDTH_RATIO,
                height: window.innerWidth * NOTE_WIDTH_RATIO * noteAspectRatio,
              }}
              onPointerDownCapture={handlePointerDown}
              onPointerMoveCapture={handlePointerMove}
              onPointerUpCapture={handlePointerUp}
            >
              <FabricJSCanvas
                className="fabric-canvas"
                onReady={onReady}
                css={{
                  // backgroundImage: `url("${NoteImg}")`,
                  touchAction: "none",
                  // display:`${isPointer? "block": "none"}`,
                  overflow: `${drawMode == "strokeErase"? "hidden": ""}`,
                  backgroundSize: "contain"
                }}
              />
            </Box>
            {drawMode == "strokeErase" &&
              <canvas
                id="erase-drawer"
                className="canvas"
                style={{ 
                  width: window.innerWidth * NOTE_WIDTH_RATIO,
                  height: window.innerWidth * NOTE_WIDTH_RATIO * noteAspectRatio
                }}
                onPointerDownCapture={handleEraseDown}
                onPointerMoveCapture={handleEraseMove}
                onPointerUpCapture={handleEraseUp}
              ></canvas>
            }
            {/* {
              !isPointer &&
              <svg
                id="erase-drawer"
                className="canvas"
                style={{ 
                  width: window.innerWidth * NOTE_WIDTH_RATIO,
                  height: window.innerWidth * NOTE_WIDTH_RATIO * noteAspectRatio
                }}
              ></svg>
            } */}
          </Box>
          {
            fabricDrawer !== undefined &&
            <NoteGraphAreas fabricDrawer={fabricDrawer} />
          }
        </Box>
      </Box>
    :<></>
    }
  </>
  );
  
}