import React, { useState } from "react";
import { useAtom } from 'jotai'
import { drawerAtom } from "@/infrastructures/jotai/drawer";
import { Box, Typography } from "@mui/material";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import Spacer from "@/components/common/Spacer";
import { penWidthList } from "@/configs/PenWidthConfig";
import { DrawerConfig } from "@/configs/DrawerConfig";

export const ChangePenWidthButton: React.FC = () => {
  // const [drawMode, setDrawMode] = useAtom(drawModeAtom);
  const [drawer, setDrawer] = useAtom(drawerAtom);
  const [isShowMenu, setIsShowMenu] = useState<boolean>(false);
  const widthList = penWidthList;

  // const setPenMode = () => {
  //   setDrawMode("pen");
  // }

  // const penIcon = (
  //   <svg xmlns="http://www.w3.org/2000/svg" className="mode-svg" viewBox="0 0 24 24" stroke="currentColor" fill="none">
  //     <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  //   </svg>
  // );
  const showMenu = () => {
    setIsShowMenu((prev) => !prev);
  }

  const changeWidth = (size: number) => {
    const newStrokeSize: number = Math.round((size) * 10)/10;
    // let newDrawerConfig = DrawerConfig;
    // newDrawerConfig.pointRadius = {
    //   "originalPoint": newStrokeSize,
    //   "spline": newStrokeSize,
    //   "dft": newStrokeSize
    // };
    // newDrawerConfig.strokeWidth = {
    //   "originalPath": newStrokeSize,
    //   "spline": newStrokeSize,
    //   "dft": newStrokeSize
    // }
    // drawer.setConfig(newDrawerConfig);
    drawer.setStrokeWidth(newStrokeSize);
    setDrawer(drawer);
  }

	return (
		<>
      <button
        className="width-button"
        // className={drawMode == "pen" ?"mode-button": "no-mode-button"}
        onClick={() => showMenu()}
      >
        <Box className="center">
          <Box>
            <Box width={drawer.strokeWidth + 2} height={drawer.strokeWidth + 2} className="width-button-circle"></Box>
            <Spacer size={5 + drawer.strokeWidth/20} axis="vertical" />
            <p className="small-text">{drawer.strokeWidth}px</p>
          </Box>
          {
            isShowMenu
            ? <ArrowDropUp className="icon" />
            : <ArrowDropDown className="icon" />
          }
        </Box>
        {
          isShowMenu &&
          <Box className="width-menu">
            {widthList.map((size, i) => (
              <Box key={i} onClick={() => changeWidth(size)} className={drawer.strokeWidth == size? "choiced-width": ""}>
                <Box>
                  <Box width={size + 2} height={size + 2} className="width-button-circle"></Box>
                  <Spacer size={3 + size/20} axis="vertical" />
                  <p className="small-text">{size}px</p>
                </Box>
              </Box>
            ))}
          </Box>
        }
      </button>
    </>
	);
}