import React from "react";
import { Drawer, Figure, Stroke } from "@nkmr-lab/average-figure-drawer";
import { DrawerConfig } from "@/configs/DrawerConfig";

export const Note:React.FC =() => {

// Object型として各Drawerを保持
const drawers: any = {};

window.onload = () => {
  // Drawerの設定
  drawers["drawer"] = new Drawer("#drawer", DrawerConfig);
};
const change = () => {
  console.log(drawers["drawer"]);
}

const undo = () => {
  drawers["drawer"].undo();
  console.log(drawers["drawer"]);
}

  return (
    <>
      <h1>書けるよー</h1>
      <div className="canvasWrapper">
        <svg id="drawer" className="canvas write"></svg>
      </div>
      <button onClick={undo}>undo</button>
      <button onClick={change}>button</button>
    </>
  );
}