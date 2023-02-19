import React, { useState } from "react";
import Logo from '@/assets/logo.png'
import { ColorButton } from "./ColorButton";
import { Link } from "react-router-dom";
import { 
  Box,
  Toolbar,
  Button,
  Typography,
  Paper
} from "@mui/material";
import { PenColorType } from "@/@types/note";
import { penColorList } from "@/configs/PenColorConfig";

export const NoteHeader:React.FC =() => {
  const [colorList, setColorList] = useState<PenColorType[]>(penColorList);

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
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Paper sx={{ background: "#37474f", borderBottom: '1px solid #57676f' }} elevation={0}  >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img 
                src={Logo}
                style={{ width: "60px", height: "60px", marginRight: "10px" }}
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

            <Box sx={{ display: "flex", alignItems: "center" }}>
            {colorList.map((el, index) => (
              <Box 
                key={index}
                className='my-auto'
              >
                <ColorButton
                  buttonColor={el.penColor}
                  isChoice={el.useable}
                  colorChange={colorChange}
                  index={index}
                />
              </Box>
            ))}
            </Box>
            
            <Button variant="outlined" color="inherit">Login</Button>
          </Toolbar>
        </Paper>
      </Box>
    </>
  );
}