import React, { useState, useEffect } from "react";
import { NoteSizeType } from "@/@types/note";
import { Drawer, Figure, Stroke } from "@nkmr-lab/average-figure-drawer";
import { DrawerConfig } from "@/configs/DrawerConfig";
import { NoteHeader } from "@/components/note/header";
import {
  Box 
} from "@mui/material";
import { useAtom } from 'jotai'
import { drawerAtom } from "@/infrastructures/jotai/Drawer";

export const Note:React.FC =() => {
  const [noteSize, setNoteSize] = useState<NoteSizeType>({width: "100%", height: "800px"})
  const [drawer, setDrawer] = useAtom<any, any, any>(drawerAtom);

  const drawers: any = {};

  const change = () => {
    // drawers["drawer2"] = new Drawer("#drawer", DrawerConfig);
    drawers["drawer"].setStrokeColor("#ff0000");
    drawers["drawer"].setStrokeColor("#ffff00");
  }

  const undo = () => {
    // drawers["drawer"].undo();
    // console.log(drawers["drawer"]);
    console.log(drawer);
    drawer.undo();
    setDrawer(drawer);
  }

  useEffect(() => {
    // Drawerの設定
    console.log("useEffect実行")
    if (drawers["drawer"] == undefined) {
      drawers["drawer"] = new Drawer("#drawer", DrawerConfig);
      setDrawer(drawers["drawer"])
    }
    
  }, [])

  return (
    <Box sx={{ width: "100%" }}>
      <NoteHeader />
      <Box className="canvasWrapper" sx={{ width: noteSize['width'], height: noteSize["height"] }}>
        <svg id="drawer" className="canvas write" style={{ width: noteSize["width"], height: noteSize["height"] }}></svg>
      </Box>
      <button onClick={() => undo()}>undo</button>
      <button onClick={change}>button</button>
    </Box>
  );
}