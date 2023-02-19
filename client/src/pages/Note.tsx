import React, { useState, useEffect } from "react";
import { NoteSizeType } from "@/@types/note";
import { Drawer, Figure, Stroke } from "@nkmr-lab/average-figure-drawer";
import { DrawerConfig } from "@/configs/DrawerConfig";
import {
  Box 
} from "@mui/material";

export const Note:React.FC =() => {
  
  const [noteSize, setNoteSize] = useState<NoteSizeType>({width: "100%", height: "800px"})

  // Object型として各Drawerを保持
  const drawers: any = {};

  const change = () => {
    // drawers["drawer2"] = new Drawer("#drawer", DrawerConfig);
    drawers["drawer"].setStrokeColor("#ff0000");
  }

  const undo = () => {
    drawers["drawer"].undo();
    console.log(drawers["drawer"]);
  }

  useEffect(() => {
    // Drawerの設定
    drawers["drawer"] = new Drawer("#drawer", DrawerConfig);
  }, [])

  return (
    <Box sx={{ width: "100%" }}>
      <Box className="canvasWrapper" sx={{ width: noteSize['width'], height: noteSize["height"] }}>
        <svg id="drawer" className="canvas write" style={{ width: noteSize["width"], height: noteSize["height"] }}></svg>
      </Box>
      <button onClick={undo}>undo</button>
      <button onClick={change}>button</button>
    </Box>
  );
}