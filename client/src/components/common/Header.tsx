import React from "react";
import { 
  Box,
  Toolbar,
  IconButton,
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
          <Toolbar>
            {/* <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <Menu />
            </IconButton> */}
            <Typography
              variant="h4"
              noWrap
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              PP-Undo
            </Typography>
          </Toolbar>
        </Paper>
      </Box>
    </>
  );
}