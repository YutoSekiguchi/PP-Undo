import { useState, useEffect, useRef, PointerEvent } from "react";
import { useAtom } from 'jotai';
import { fabric } from "fabric";
import { FabricJSCanvas, FabricJSEditorHook, useFabricJSEditor } from "fabricjs-react";
import { FabricDrawer } from "@/modules/fabricdrawer";
import { Box, Button } from "@mui/material";
import { NoteGraphAreas } from "@/components/note/graphAreas";
import { averagePressure } from "@/modules/note/AveragePressure";
import { NewNoteHeader } from "@/components/newnote/header";
import { addHistoryAtom, drawModeAtom, historyAtom, historyForRedoAtom } from "@/infrastructures/jotai/drawer";
import { isLineSegmentIntersecting } from "@/modules/note/IsLineSegmentIntersecting";
import { distanceFromPointToLine } from "@/modules/note/DistanceFromPointToLine";
import { getMinimumPoints } from "@/modules/note/GetMinimumPoints";

let drawStartTime: number = 0; // 描画時の時刻
let drawEndTime: number = 0; // 描画終了時の時刻

export const NewNote: () =>JSX.Element = () => {
  const { editor, onReady } = useFabricJSEditor();

  const noteSize: {width: number, height: number} = {width: 800, height: 800}
  const [isDraw, setIsDraw] = useState<boolean>(false);
  const [strokePressure, setStrokePressure] = useState<number[]>([]);
  const [prevOffset, setPrevOffset] = useState<{x: number, y: number} | null>(null);
  const [cropImage, setCropImage] = useState(true);
  const [fabricDrawer, setFabricDrawer] = useState<FabricDrawer | null>(null);
  const [eraseStrokes, setEraseStrokes] = useState<any[]>([]);
  const [drawMode, ] = useAtom(drawModeAtom); // penか消しゴムか
  const [history, ] = useAtom(historyAtom); // 操作の履歴
  const [, addHistory] = useAtom(addHistoryAtom);
  const [, setHistoryForRedo] = useAtom(historyForRedoAtom);

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
    console.log("editor change")
    if (fabricDrawer == null && !!editor) {
      const instance = new FabricDrawer(editor);
      setFabricDrawer(instance);
    }
    editor.canvas.renderAll();
  }, [editor]);
  

  useEffect(() => {
    if (!editor || !fabric) {
      return;
    }
    fabricDrawer?.setDrawingMode();
    fabricDrawer?.setCanvasSize(noteSize.width, noteSize.height);
    fabricDrawer?.reDraw();
  }, [fabricDrawer]);

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
    const imgUrl = "https://thegraphicsfairy.com/wp-content/uploads/2019/02/Anatomical-Heart-Illustration-Black-GraphicsFairy.jpg";
    fabricDrawer?.setBackgroundImage(imgUrl);
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
    drawStartTime = performance.now();
    setIsDraw(true);
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDraw) { return; } // ポインター位置を取得
    if (event.pressure !== 0) {
      console.log(event.pressure)
      setStrokePressure([...strokePressure, event.pressure]);
    }
  }

  const handlePointerUp = () => {
    drawEndTime = performance.now();
    setIsDraw(false);
    const resultPressure = averagePressure(strokePressure);
    setStrokePressure([]);
    setTimeout(() => {
      if (drawMode == "pen") {
        const finalStroke = fabricDrawer?.getFinalStroke();
        if (finalStroke) {
          addHistory({
            type: "pen",
            strokes: [finalStroke]
          })
        }
      }
    }, 100)
  }

  const handleEraseDown = () => {
    drawStartTime = performance.now();
    setIsDraw(true);
  }

  const handleEraseMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!isDraw && drawMode === "strokeErase") { return; }
    setStrokePressure([...strokePressure, event.pressure]);
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

  return (
    <Box className="width100 note">
      <NewNoteHeader fabricDrawer={fabricDrawer} />
      <Box sx={{ display: "flex" }} className="width100">
        <Box className="canvasWrapper" id="canvasWrapper" sx={{ width: noteSize['width'], height: noteSize["height"], position: "relative" }}>
          <Box
            className="fabric-canvas-wrapper"
            sx={{width: `${noteSize.width}px`, height: `${noteSize.height}px` }}
            onPointerDownCapture={handlePointerDown}
            onPointerMoveCapture={handlePointerMove}
            onPointerUpCapture={handlePointerUp}
          >
            <FabricJSCanvas
              className="fabric-canvas"
              onReady={onReady}
            />
          </Box>
          {drawMode == "strokeErase" &&
            <svg
              id="erase-drawer"
              className="canvas"
              style={{ width: `${noteSize.width}px`, height: `${noteSize.height}px` }}
              onPointerDownCapture={handleEraseDown}
              onPointerMoveCapture={handleEraseMove}
              onPointerUpCapture={handleEraseUp}
            ></svg>
          }
        </Box>
        {/* <NoteGraphAreas /> */}
      </Box>
      {/* <Button onClick={save}>Save</Button>
      <Button onClick={test}>TEST(出力チェック)</Button> */}
    </Box>
  );
  
}