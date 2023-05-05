import { useState, useEffect, useRef, PointerEvent } from "react";
import { useAtom } from 'jotai';
import { fabric } from "fabric";
import { FabricJSCanvas, FabricJSEditorHook, useFabricJSEditor } from "fabricjs-react";
import { FabricDrawer } from "@/modules/fabricdrawer";
import { Box, Button } from "@mui/material";
import { isAuth } from "@/modules/common/isAuth";
import { NoteGraphAreas } from "@/components/newnote/graphAreas";
import { averagePressure } from "@/modules/note/AveragePressure";
import { NewNoteHeader } from "@/components/newnote/header";
import { addAvgPressureOfStrokeAtom, addHistoryAtom, avgPressureOfStrokeAtom, backgroundImageAtom, drawModeAtom, historyAtom, historyForRedoAtom, logRedoCountAtom, ppUndoCountAtom, redoCountAtom, sliderValueAtom, undoCountAtom } from "@/infrastructures/jotai/drawer";
import { isLineSegmentIntersecting } from "@/modules/note/IsLineSegmentIntersecting";
import { distanceFromPointToLine } from "@/modules/note/DistanceFromPointToLine";
import { getMinimumPoints } from "@/modules/note/GetMinimumPoints";
import Note from "@/assets/note.png"
import { Params, useParams } from "react-router-dom";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { myNoteAtom } from "@/infrastructures/jotai/notes";
import { fetchNoteByID, updateNote } from "@/infrastructures/services/note";
import { NoteDataType } from "@/@types/notefolders";
import { PostStrokeDataType } from "@/@types/note";
import { addStroke } from "@/infrastructures/services/strokes";

let drawStartTime: number = 0; // 描画時の時刻
let drawEndTime: number = 0; // 描画終了時の時刻
let strokePressureList: number[] = [];

export const NewNote: () =>JSX.Element = () => {
  const { editor, onReady } = useFabricJSEditor();

  const params: Params<string> = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const noteSize: {width: number, height: number} = {width: 800, height: 3000}
  const [isDraw, setIsDraw] = useState<boolean>(false);
  const [prevOffset, setPrevOffset] = useState<{x: number, y: number} | null>(null);
  const [cropImage, setCropImage] = useState(true);
  const [fabricDrawer, setFabricDrawer] = useState<FabricDrawer | null>(null);
  const [eraseStrokes, setEraseStrokes] = useState<any[]>([]);
  const [myNote, setMyNote] = useAtom(myNoteAtom);
  const [drawMode, ] = useAtom(drawModeAtom); // penか消しゴムか
  const [history, ] = useAtom(historyAtom); // 操作の履歴
  const [, addHistory] = useAtom(addHistoryAtom);
  const [, setHistoryForRedo] = useAtom(historyForRedoAtom);
  const [backgroundImage, setBackgroundImage] = useAtom(backgroundImageAtom);
  const [avgPressureOfStroke, ] = useAtom(avgPressureOfStrokeAtom);
  const [, setAddAvgPressureOfStroke] = useAtom(addAvgPressureOfStrokeAtom);
  const [undoCount, setUndoCount] = useAtom(undoCountAtom);
  const [redoCount, setRedoCount] = useAtom(redoCountAtom);
  const [logRedoCount, setLogRedoCount] = useAtom(logRedoCountAtom);
  const [ppUndoCount, setPPUndoCount] = useAtom(ppUndoCountAtom);

  useEffect(() => {
    if (!editor || !fabric || !(fabricDrawer == null && !!editor)) {
      return;
    }

    // if (cropImage) {
    //   editor.canvas.__eventListeners = {};
    //   return;
    // }

    // if (!editor.canvas.__eventListeners["mouse:wheel"]) {
    //   editor.canvas.on("mouse:wheel", function (opt) {
    //     var delta = opt.e.deltaY;
    //     var zoom = editor.canvas.getZoom();
    //     zoom *= 0.999 ** delta;
    //     if (zoom > 20) zoom = 20;
    //     if (zoom < 0.01) zoom = 0.01;
    //     editor.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    //     opt.e.preventDefault();
    //     opt.e.stopPropagation();
    //   });
    // }

    // if (!editor.canvas.__eventListeners["mouse:down"]) {
    //   editor.canvas.on("mouse:down", function (this: any) {
    //     this.isDragging = true;
    //     console.log(editor.canvas)
    //   });
    // }

    // if (!editor.canvas.__eventListeners["mouse:move"]) {
    //   editor.canvas.on("mouse:move", function (this: any) {
    //     if (this.isDragging) {
    //     }
    //   });
    // }

    // if (!editor.canvas.__eventListeners["mouse:up"]) {
    //   editor.canvas.on("mouse:up", function (this: any) {
    //     // on mouse up we want to recalculate new interaction
    //     // for all objects, so we call setViewportTransform
    //     this.isDragging = false;

    //   });
    // }

    const firstLoadData = async () => {
      const noteData: NoteDataType | null = await getFirstStrokeData();
      const instance = new FabricDrawer(editor);
      setFabricDrawer(instance);
      finishLoading(100);
    }
    console.log("editor change")
    if (fabricDrawer == null && !!editor) {
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
    fabricDrawer?.setCanvasSize(noteSize.width, noteSize.height);
    setBackgroundImage(Note);
    fabricDrawer?.reDraw();
  }, [fabricDrawer, backgroundImage]);

  const getFirstStrokeData = async () => {
    const data: NoteDataType | null = await fetchNoteByID(Number(params.id));
    setMyNote(data);
    // const clientLogData: ClientLogDataType[] | null = await fetchClientLogsByNID(Number(params.id))
    // const tmp: any[] = [];
    // clientLogData?.map((clientLog: ClientLogDataType, i: number) => {
    //   tmp.push(clientLog.Data);
    // });
    // setLogOfBeforePPUndo(tmp);
    return data
  }

  const finishLoading = (time: number) => {
    setTimeout(() => {
      setIsLoading(false);
    }, time);
  }

  const toggleSize = () => {
    fabricDrawer?.setStrokeWidth(2);
  };

  const toggleDraw = () => {
    fabricDrawer?.setDrawingMode();
  };

  const togglePoint = () => {
    fabricDrawer?.setPointingMode();
  }

  const clear = () => {
    history.splice(0, history.length);
    fabricDrawer?.clear();
  };

  const removeSelectedObject = () => {
    fabricDrawer?.removeSelectedStrokes();
  };

  const onAddCircle = () => {
    fabricDrawer?.addText({
      mode: "circle",
    });
    fabricDrawer?.addText({
      mode: "line",
    });
  };
  const onAddRectangle = () => {
    fabricDrawer?.addText({
      mode: "rect"
    });
  };
  const addText = () => {
    fabricDrawer?.addText({
      mode: "text",
      text: "aaaa",
    });
  };

  const addBackground = () => {
    if (!editor || !fabric) {
      return;
    }
    const imgUrl = Note;
    fabricDrawer?.setBackgroundImage(imgUrl, noteSize.width, noteSize.height);
  };

  const exportSVG = () => {
    const svg = fabricDrawer?.getSVG();
    if (svg === undefined) {
      alert("svgとして取得できませんでした");
      return;
    }
    console.log(svg);
  };

  const handlePointerDown = () => {
    setHistoryForRedo([]);
    strokePressureList = [];
    drawStartTime = performance.now();
    setIsDraw(true);
    console.log(editor)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDraw) { return; } // ポインター位置を取得
    if (event.pressure !== 0) {
      console.log(event.pressure)
      strokePressureList = [...strokePressureList, event.pressure];
    }
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
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
      console.log(editor);
    }, 100)
  }

  const postStrokeData = async (pressure: number, strokePressureList: number[]) => {
    const data: PostStrokeDataType = {
      UID: myNote!.UID,
      NID: myNote!.ID,
      StrokeData: {"Strokes": fabricDrawer?.getAllStrokes()},
      AvgPressure: pressure,
      PressureList: strokePressureList.join(','),
      Time: drawEndTime - drawStartTime,
      Mode: drawMode,
      Save: 0,
    }
    await addStroke(data);
  }

  const handleEraseDown = () => {
    strokePressureList = [];
    drawStartTime = performance.now();
    setIsDraw(true);
  }

  const handleEraseMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!isDraw && drawMode === "strokeErase") { return; }
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
  
  const handleEraseUp = () => {
    drawEndTime = performance.now();
    setPrevOffset(null);
    setIsDraw(false);
    setTimeout(() => {
      if (eraseStrokes.length > 0) {
        addHistory({
          type: "erase",
          strokes: eraseStrokes
        })
      }
      setEraseStrokes([]);
    }, 100)
  }

  const save = async() => {
    try {
      myNote!.NoteImage = fabricDrawer!.getImg();
      myNote!.StrokeData = {"Strokes": fabricDrawer!.getAllStrokes()};
      myNote!.AvgPressure = fabricDrawer!.getAveragePressure();
      myNote!.AvgPressureList = fabricDrawer!.getPressureList().join(',');
      myNote!.AllAvgPressureList = avgPressureOfStroke.join(',');
      myNote!.AllStrokeCount = avgPressureOfStroke.length;
      myNote!.StrokeCount = fabricDrawer!.getStrokeLength();
      myNote!.UndoCount += undoCount;
      myNote!.RedoCount += redoCount;
      myNote!.LogRedoCount += logRedoCount;
      myNote!.PPUndoCount += ppUndoCount;
      myNote!.BackgroundImage = Note;
      await updateNote(myNote!);
      console.log("保存しました");
    } catch (error) {
      alert("保存に失敗しました");
      throw error;
    }
  }


  return (
    <>
    {
      (isAuth() && isLoading)&& <LoadingScreen /> 
    }
    {
      isAuth()?
      <Box className="width100 note">
        <NewNoteHeader fabricDrawer={fabricDrawer} />
        <Box sx={{ display: "flex" }} className="width100">
          <Box className="canvasWrapper" id="canvasWrapper" sx={{ width: noteSize['width'], height: noteSize["height"], position: "relative" }}>
            <Box
              className="fabric-canvas-wrapper"
              sx={{width: `75vw`, height: `${noteSize.height}px` }}
              onPointerDownCapture={handlePointerDown}
              onPointerMoveCapture={handlePointerMove}
              onPointerUpCapture={handlePointerUp}
            >
              <FabricJSCanvas
                className="fabric-canvas"
                onReady={onReady}
                css={{
                  backgroundImage: `url("${Note}")`,
                  // touchAction: "none",
                  // display:`${(canvasHeight!=0&&canvasWidth!=0)? "block": "none"}`,
                  // backgroundSize: "contain"
                }}
              />
            </Box>
            {drawMode == "strokeErase" &&
              <svg
                id="erase-drawer"
                className="canvas"
                style={{ width: `75vw`, height: `${noteSize.height}px` }}
                onPointerDownCapture={handleEraseDown}
                onPointerMoveCapture={handleEraseMove}
                onPointerUpCapture={handleEraseUp}
              ></svg>
            }
          </Box>
          <NoteGraphAreas fabricDrawer={fabricDrawer} />
        </Box>
        <Button onClick={save}>Save</Button>
        {/* <Button onClick={test}>TEST(出力チェック)</Button> */}
      </Box>
    :<></>
    }
  </>
  );
  
}