import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Logo from '@/assets/logo.png'
import { 
  Box,
  Toolbar,
  Typography,
  Paper,
} from "@mui/material";
import { penColorList } from "@/configs/PenColorConfig";
import Spacer from "@/components/common/Spacer";
import { TPenColor } from "@/@types/newnote";
import { FabricDrawer } from "@/modules/fabricdrawer";
import { ColorButton } from "./ColorButton";
import { penWidthList } from "@/configs/PenWidthConfig";
import { ChangePenWidthButton } from "./ChangePenWidthButton";
import { PenButton } from "./PenButton";
import { PointerButton } from "./PointerButton";
import { StrokeEraseButton } from "./StrokeEraseButton";
import { UndoButton } from "./UndoButton";
import { RedoButton } from "./RedoButton";

export const NewNoteHeader:React.FC<{fabricDrawer: FabricDrawer | null}> = ({ fabricDrawer }) => {
  const navigate = useNavigate();
  const colorList: TPenColor[] = penColorList;
  const [color, setColor] = useState<string>(penColorList[0].penColor);
  const [strokeWidth, setStrokeWidth] = useState<number>(penWidthList[1]);

  
  const backToHome = () => {
    navigate('/notefolders/0');
  }

  // 今の色表示&カラーピッカー
  const ColorPicker: React.FC = () => {

    return (
      <Box className="now-color">
        <input
          className="color-picker"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <Typography fontSize={6} align="center">Now</Typography>
      </Box>
    );
  }
  

  useEffect(() => {
    fabricDrawer?.changeColor(color);
  }, [color]);

  useEffect(() => {
    fabricDrawer?.setStrokeWidth(strokeWidth)
  }, [strokeWidth])

  return (
    <>
      <Box className="note-header">
        <Paper sx={{ background: "#F2F6FC", borderBottom: '1px solid #F2F6FC' }} elevation={0}  >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box 
              className="center pointer"
              onClick={backToHome}
            >
              <img 
                src={Logo}
                style={{ width: "40px", height: "40px", marginRight: "10px" }}
                alt="PP-Undo logo"
              />
              <Typography
                variant="h5"
                noWrap
                component="div"
                sx={{ fontWeight: "bold" }}
              >
                PP-Undo
              </Typography>
            </Box>

            <Box className="align-center">
              <Box className="align-center" sx={{ marginRight: "60px"}}>
                <PointerButton fabricDrawer={fabricDrawer} />
                <Spacer size={6} axis="horizontal" />
                <StrokeEraseButton fabricDrawer={fabricDrawer} />
                <Spacer size={6} axis="horizontal" />
                <PenButton fabricDrawer={fabricDrawer} />
              </Box>
              {colorList.map((el, index) => (
                <Box 
                  key={index}
                >
                  <ColorButton
                    buttonColor={el.penColor}
                    isChoice={el.useable}
                    setColor={setColor}
                    fabricDrawer={fabricDrawer}
                  />
                </Box>
              ))}
              <Spacer size={6} axis="horizontal" />
              <ColorPicker />
              
              <Box className="align-center" sx={{ marginLeft: "20px"}}>
                <ChangePenWidthButton
                  strokeWidth={strokeWidth}
                  setStrokeWidth={setStrokeWidth}
                />
              </Box>
            </Box>
            
            <Box className="align-center">
              <UndoButton fabricDrawer={fabricDrawer} />
              <Spacer size={4} axis="horizontal" />
              <RedoButton fabricDrawer={fabricDrawer} />
            </Box>
          </Toolbar>
        </Paper>
      </Box>
    </>
  );
}