import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Logo from '@/assets/logo.png'
import { ColorButton } from "./ColorButton";
import { UndoButton } from "./UndoButton";
import { StrokeEraseButton } from "./StrokeEraseButton";
import { 
  Box,
  Toolbar,
  Typography,
  Paper
} from "@mui/material";
import { PenColorType } from "@/@types/note";
import { penColorList } from "@/configs/PenColorConfig";
import { RedoButton } from "./RedoButton";
import Spacer from "@/components/common/Spacer";
import { PenButton } from "./PenButton";
import { ChangePenWidthButton } from "./ChangePenWidthButton";

export const NoteHeader:React.FC =() => {
  const [colorList, setColorList] = useState<PenColorType[]>(penColorList);
  const navigate = useNavigate();

  const colorChange = (index: number) => {
    let tmp = colorList.slice(0, colorList.length); ;
    for (let i=0; i<colorList.length; i++) {
      if (i == index) {
        tmp[i].useable = true;
      } else {
        tmp[i].useable = false;
      }
    }
    setColorList(tmp);
  }

  const backToHome = () => {
    navigate('/');
  }

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
                <StrokeEraseButton />
                <Spacer size={6} axis="horizontal" />
                <PenButton />
              </Box>
              {colorList.map((el, index) => (
                <Box 
                  key={index}
                >
                  <ColorButton
                    buttonColor={el.penColor}
                    isChoice={el.useable}
                    colorChange={colorChange}
                    index={index}
                  />
                </Box>
              ))}
              <Box className="align-center" sx={{ marginLeft: "20px"}}>
                <ChangePenWidthButton />
              </Box>
            </Box>
            
            <Box className="align-center">
              <UndoButton />
              <Spacer size={4} axis="horizontal" />
              <RedoButton />
            </Box>
          </Toolbar>
        </Paper>
      </Box>
    </>
  );
}