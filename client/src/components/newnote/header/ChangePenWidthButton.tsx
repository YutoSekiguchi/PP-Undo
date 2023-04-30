import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import Spacer from "@/components/common/Spacer";
import { penWidthList } from "@/configs/PenWidthConfig";
import { TChangePenWidthButton } from "@/@types/newnote";

export const ChangePenWidthButton: React.FC<TChangePenWidthButton> = ({ strokeWidth, setStrokeWidth }) => {
  const [isShowMenu, setIsShowMenu] = useState<boolean>(false);
  const widthList = penWidthList;

  const showMenu = () => {
    setIsShowMenu((prev) => !prev);
  }

  const changeWidth = (size: number) => {
    const newStrokeSize: number = Math.round((size) * 10)/10;
    setStrokeWidth(newStrokeSize);
  }

	return (
		<>
      <button
        className="width-button"
        onClick={() => showMenu()}
      >
        <Box className="center">
          <Box>
            <Box width={strokeWidth + 4} height={strokeWidth + 4} className="width-button-circle"></Box>
            <Spacer size={8} axis="vertical" />
            <Typography fontSize={6}>{strokeWidth}px</Typography>
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
              <Box key={i} onClick={() => changeWidth(size)} className={strokeWidth == size? "choiced-width": ""}>
                <Box>
                  <Box width={size + 4} height={size + 4} className="width-button-circle"></Box>
                  <Spacer size={3 + size/20} axis="vertical" />
                  <Typography fontSize={12}>{size}px</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        }
      </button>
    </>
	);
}