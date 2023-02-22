import React, { useState, useEffect } from "react";
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
  const [noteSize, setNoteSize] = useState<NoteSizeType>({width: "100%", height: "800px"})
  const [drawer, setDrawer] = useAtom(drawerAtom);
  const [, setNumOfStroke] = useAtom(drawerNumOfStrokeAtom);
  const [, clearUndoStrokeLog] = useAtom(clearUndoStrokeLogAtom);

  const drawers: any = {};

  useEffect(() => {
    // Drawerの設定
    if (drawers["drawer"] == undefined) {
      drawers["drawer"] = new Drawer("#drawer", DrawerConfig);
      setDrawer(drawers["drawer"])
    }
  }, [])

  const finishDraw = () => {
    setDrawer(drawer);
    setNumOfStroke(drawer.numOfStroke);
    clearUndoStrokeLog();
  }

  useEffect(() => {
    // console.log(drawer.numOfStroke)
  }, [drawer])

  return (
    <Box sx={{ width: "100%" }}>
      <NoteHeader />
      <Box className="canvasWrapper" sx={{ width: noteSize['width'], height: noteSize["height"] }}>
        <svg
          id="drawer"
          className="canvas write"
          style={{ width: noteSize["width"], height: noteSize["height"] }}
          onPointerUpCapture={() => finishDraw()}
        ></svg>
      </Box>
    </Box>
  );
}