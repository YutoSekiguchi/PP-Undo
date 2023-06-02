import { useState, useEffect, PointerEvent } from "react";
import { useAtom } from 'jotai';
import { fabric } from "fabric";
import lscache from "lscache";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { FabricDrawer } from "@/modules/fabricdrawer";
import { Box } from "@mui/material";
import { isAuth } from "@/modules/common/isAuth";
import { NoteGraphAreas } from "@/components/note/graphAreas";
import { averagePressure } from "@/modules/note/AveragePressure";
import { NewNoteHeader } from "@/components/note/header";
import { addAvgPressureOfStrokeAtom, addHistoryAtom, avgPressureOfStrokeAtom, backgroundImageAtom, drawModeAtom, historyForRedoAtom, isDemoAtom, logOfBeforePPUndoAtom, logRedoCountAtom, noteAspectRatiotAtom, ppUndoCountAtom, redoCountAtom, resetAtom, undoCountAtom } from "@/infrastructures/jotai/drawer";
import { isLineSegmentIntersecting } from "@/modules/note/IsLineSegmentIntersecting";
import { getMinimumPoints } from "@/modules/note/GetMinimumPoints";
import NoteImg from "@/assets/notesolidb.svg"
import { Location, Params, useLocation, useNavigate, useParams } from "react-router-dom";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { myNoteAtom } from "@/infrastructures/jotai/notes";
import { fetchNoteByID, updateNote } from "@/infrastructures/services/note";
import { TNoteData } from "@/@types/notefolders";
import { TClientLogData, TPostStrokeData } from "@/@types/note";
import { addStroke } from "@/infrastructures/services/strokes";
import { fetchClientLogsByNID } from "@/infrastructures/services/ppUndoLogs";
import { NOTE_WIDTH_RATIO, PRESSURE_ROUND_VALUE } from "@/configs/settings";
import { confirmNumberArrayFromString } from "@/modules/common/confirmArrayFromString";
import { rgbToHex } from "@/modules/note/RGBToHex";

let drawStartTime: number = 0; // 描画時の時刻
let drawEndTime: number = 0; // 描画終了時の時刻
let strokePressureList: number[] = [];
let scrollTop = 0;

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
  const [, setLogOfBeforePPUndo] = useAtom(logOfBeforePPUndoAtom);
  const [undoCount, ] = useAtom(undoCountAtom);
  const [redoCount, ] = useAtom(redoCountAtom);
  const [logRedoCount, ] = useAtom(logRedoCountAtom);
  const [ppUndoCount, ] = useAtom(ppUndoCountAtom);
  const [noteAspectRatio, setNoteAspectRatio] = useAtom(noteAspectRatiotAtom);
  const [, setReset] = useAtom(resetAtom);

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
            console.log(confirmNumberArrayFromString(noteData.AllAvgPressureList));
          }
          for(let i=0; i<editor.canvas._objects.length; i++) {
            if (editor.canvas._objects[i].stroke!.slice(0, 3) === "rgb") {
              editor.canvas._objects[i].stroke = rgbToHex(editor.canvas._objects[i].stroke!)
            }
            Object.assign(editor.canvas._objects[i], { pressure: noteData.StrokeData.strokes.pressure[i] });
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
      const resultPressure: number = event.pointerType=="mouse"?Math.random(): averagePressure(strokePressureList);
      fabricDrawer?.setPressureToStroke(resultPressure);
      addHistory({
        type: "pen",
        strokes: [finalStroke]
      })
      postStrokeData(resultPressure, strokePressureList);
    }
    //
    setHistoryForRedo([]);
    strokePressureList = [];
    setIsDraw(true);
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDraw || event.pointerType === "touch") {return;}
    if (event.pressure !== 0) {
      strokePressureList = [...strokePressureList, Math.round(event.pressure*PRESSURE_ROUND_VALUE)/PRESSURE_ROUND_VALUE];
    }
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    // if (event.pointerType === "touch") { return; }
    drawEndTime = Math.round(performance.now() * PRESSURE_ROUND_VALUE) / PRESSURE_ROUND_VALUE;
    setIsDraw(false);
    const resultPressure: number = event.pointerType=="mouse"?Math.round(Math.random() * PRESSURE_ROUND_VALUE)/PRESSURE_ROUND_VALUE: averagePressure(strokePressureList);
    setTimeout(() => {
      if (drawMode == "pen") {
        setAddAvgPressureOfStroke(resultPressure);
        const finalStroke = fabricDrawer?.getFinalStroke();
        if (finalStroke) {
          fabricDrawer?.setPressureToStroke(resultPressure);
          addHistory({
            type: "pen",
            strokes: [finalStroke]
          })
          postStrokeData(resultPressure, strokePressureList);
        }
        fabricDrawer?.reDraw();
      }
    }, 100);
  }

  const postStrokeData = async (pressure: number, strokePressureList: number[]) => {
    if(isDemo) {return;}
    const data: TPostStrokeData = {
      UID: myNote!.UID,
      NID: myNote!.ID,
      StrokeData: {"Strokes": {"pressure": fabricDrawer?.getPressureList(), "svg": fabricDrawer?.getSVG(), "data": ""}},
      AvgPressure: pressure,
      PressureList: strokePressureList.join(','),
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
    const resultPressure: number = event.pointerType=="mouse"?Math.random(): averagePressure(strokePressureList);
    setTimeout(() => {
      if (eraseStrokes.length > 0) {
        addHistory({
          type: "erase",
          strokes: eraseStrokes
        })
      }
      postStrokeData(resultPressure, strokePressureList);
      setEraseStrokes([]);
    }, 100)
  }

  const save = async() => {
    console.log(avgPressureOfStroke)
    if (isDemo) { return; }
    try {
      myNote!.NoteImage = fabricDrawer!.getImg();
      myNote!.StrokeData = {"Strokes": {"data": editor?.canvas.getObjects(), "pressure": fabricDrawer!.getPressureList(), "svg": fabricDrawer?.getSVG()}};
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
      console.log(myNote!.StrokeData)
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
                  backgroundImage: `url("${NoteImg}")`,
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