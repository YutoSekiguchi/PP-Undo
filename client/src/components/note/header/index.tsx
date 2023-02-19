import React from "react";
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

export const NoteHeader:React.FC =() => {
  const colorList: string[] = ['#000000', '#808080', '#D9D9D9', '#1C8CFF', '#FF1A40', '#2BD965', '#FFDD33'];
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
            {colorList.map((label, index) => (
              <Box 
                // onClick={() => buttonClick(label, index)} 
                key={index}
                className='my-auto'
              >
                <ColorButton buttonColor={label} />
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