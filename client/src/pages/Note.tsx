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
import { addAvgPressureOfStrokeAtom, addHistoryAtom, avgPressureOfStrokeAtom, backgroundImageAtom, drawModeAtom, historyAtom, historyForRedoAtom, isDemoAtom, logOfBeforePPUndoAtom, logRedoCountAtom, noteAspectRatiotAtom, ppUndoCountAtom, redoCountAtom, resetAtom, undoCountAtom } from "@/infrastructures/jotai/drawer";
import { isLineSegmentIntersecting } from "@/modules/note/IsLineSegmentIntersecting";
import { getMinimumPoints } from "@/modules/note/GetMinimumPoints";
import NoteImg from "@/assets/notesolidb.svg"
import { Location, Params, useLocation, useNavigate, useParams } from "react-router-dom";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { myNoteAtom } from "@/infrastructures/jotai/notes";
import { fetchNoteByID, updateNote } from "@/infrastructures/services/note";
import { NoteDataType } from "@/@types/notefolders";
import { TClientLogData, TPostStrokeData } from "@/@types/note";
import { addStroke } from "@/infrastructures/services/strokes";
import { fetchClientLogsByNID } from "@/infrastructures/services/ppUndoLogs";
import { NOTE_WIDTH_RATIO } from "@/configs/settings";
import { confirmNumberArrayFromString } from "@/modules/common/confirmArrayFromString";
import { rgbToHex } from "@/modules/note/RGBToHex";

let drawStartTime: number = 0; // 描画時の時刻
let drawEndTime: number = 0; // 描画終了時の時刻
let strokePressureList: number[] = [];

export const Note: () => JSX.Element = () => {
  const { editor, onReady } = useFabricJSEditor();
  
  const navigate = useNavigate();
  const location: Location = useLocation();
  const params: Params<string> = useParams();
  const isDemo = (location.pathname.indexOf("/demo/")>-1 || location.pathname.indexOf("/demo")>-1);
  const [, setIsDemo] = useAtom(isDemoAtom)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDraw, setIsDraw] = useState<boolean>(false);
  const [prevOffset, setPrevOffset] = useState<{x: number, y: number} | null>(null);
  const [fabricDrawer, setFabricDrawer] = useState<FabricDrawer>();
  const [eraseStrokes, setEraseStrokes] = useState<any[]>([]);
  const [myNote, setMyNote] = useAtom(myNoteAtom);
  const [drawMode, ] = useAtom(drawModeAtom); // penか消しゴムか
  const [isPointer, setIsPointer] = useState<boolean>(true);
  const [history, ] = useAtom(historyAtom); // 操作の履歴
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
      setReset();
      const noteData: NoteDataType | null = await getFirstStrokeData();
      const instance = new FabricDrawer(editor);
      setFabricDrawer(instance);
      if (instance?.getStrokeLength() == 0) {
        if (noteData !== null) {
          instance?.setSVGFromString(noteData.StrokeData.strokes.svg);
          setAvgPressureOfStroke(confirmNumberArrayFromString(noteData.AllAvgPressureList));
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
      save();
    }
  }, [isLoading])

  const getFirstStrokeData = async () => {
    if (isDemo) {
      return null;
    }
    const userData = lscache.get('loginUserData');
    const data: NoteDataType | null = await fetchNoteByID(Number(params.id));
    if(data?.UID !== Number(userData.ID)) {
      navigate('/notefolders/0');
    }
    setMyNote(data);
    const clientLogData: TClientLogData[] | null = await fetchClientLogsByNID(Number(params.id))
    const tmp: any[] = [];
    clientLogData?.map((clientLog: TClientLogData, i: number) => {
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
    if (event.pointerType === "touch") {
      fabricDrawer?.setPointingMode();
      setIsPointer(false);
      return;
    }
    if (!isPointer) {
      setIsPointer(true);
    }
    // 前のストロークが要素をはみ出してしまっていた時の処理
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
    drawStartTime = performance.now();
    setIsDraw(true);
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDraw || event.pointerType === "touch") {return;}
    if (event.pressure !== 0) {
      strokePressureList = [...strokePressureList, event.pressure];
    }
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") { return; }
    drawEndTime = performance.now();
    setIsDraw(false);
    const resultPressure: number = event.pointerType=="mouse"?Math.random(): averagePressure(strokePressureList);
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
      }
    }, 100)
  }

  const postStrokeData = async (pressure: number, strokePressureList: number[]) => {
    if(isDemo) {return;}
    const data: TPostStrokeData = {
      UID: myNote!.UID,
      NID: myNote!.ID,
      StrokeData: {"Strokes": {"pressure": fabricDrawer?.getStrokeLength(), "svg": ""}},
      AvgPressure: pressure,
      PressureList: strokePressureList.join(','),
      Time: drawEndTime - drawStartTime,
      Mode: drawMode,
      Save: 0,
    }
    await addStroke(data);
  }

  const handleEraseDown = (event: PointerEvent<SVGSVGElement>) => {
    if (event.pointerType === "touch") {
      fabricDrawer?.setPointingMode();
      setIsPointer(false);
      return;
    }
    if (!isPointer) {
      setIsPointer(true);
    }
    strokePressureList = [];
    drawStartTime = performance.now();
    setIsDraw(true);
  }

  const handleEraseMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!isDraw && drawMode === "strokeErase") { return; }
    if (event.pointerType === "touch") { return; }
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
          const prevPointX = Math.round(points[1] + diffLeft), prevPointY = Math.round(points[2] + diffTop);
          const pointX = Math.round(points[3] + diffLeft), pointY = Math.round(points[4] + diffTop);
          if (prevOffset !== null) {
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
            if ((isIntersect ) && stroke) {
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
  
  const handleEraseUp = (event: PointerEvent<SVGSVGElement>) => {
    if (event.pointerType === "touch") { return; }
    drawEndTime = performance.now();
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
    if (isDemo) { return; }
    try {
      myNote!.NoteImage = fabricDrawer!.getImg();
      myNote!.StrokeData = {"Strokes": {"data": editor?.canvas.getObjects(), "pressure": fabricDrawer!.getPressureList(), "svg": fabricDrawer?.getSVG()}};
      myNote!.AvgPressure = fabricDrawer!.getAveragePressure();
      myNote!.AvgPressureList = editor!.canvas._objects.join(',');
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
                  backgroundSize: "contain"
                }}
              />
            </Box>
            {drawMode == "strokeErase" &&
              <svg
                id="erase-drawer"
                className="canvas"
                style={{ 
                  width: window.innerWidth * NOTE_WIDTH_RATIO,
                  height: window.innerWidth * NOTE_WIDTH_RATIO * noteAspectRatio
                }}
                onPointerDownCapture={handleEraseDown}
                onPointerMoveCapture={handleEraseMove}
                onPointerUpCapture={handleEraseUp}
              ></svg>
            }
            {
              !isPointer &&
              <svg
                id="erase-drawer"
                className="canvas"
                style={{ 
                  width: window.innerWidth * NOTE_WIDTH_RATIO,
                  height: window.innerWidth * NOTE_WIDTH_RATIO * noteAspectRatio
                }}
              ></svg>
            }
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