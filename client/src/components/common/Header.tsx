import React from "react";
import Logo from '@/assets/logo.png'
import { 
  Box,
  Toolbar,
  Button,
  Typography,
  Paper
} from "@mui/material";
import {
  Menu
} from "@mui/icons-material"

export const Header:React.FC =() => {

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
            
            <Button variant="outlined" color="inherit">Login</Button>
          </Toolbar>
        </Paper>
      </Box>
    </>
  );
}