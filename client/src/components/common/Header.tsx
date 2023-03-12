import React from "react";
import Logo from '@/assets/logo.png'
import { Link, useLocation, Location } from "react-router-dom";
import { notShowPathList } from "@/configs/NotShowPath";
import { 
  Box,
  Toolbar,
  Button,
  Typography,
  Paper
} from "@mui/material";

export const Header:React.FC =() => {
  const location: Location = useLocation();

  return (
    <>
      {!notShowPathList.includes(location.pathname) &&
        <Box sx={{ flexGrow: 1 }}>
          <Paper sx={{ background: "#37474f", borderBottom: '1px solid #57676f' }} elevation={0}  >
            <Toolbar sx={{ justifyContent: "space-between" }}>
              <Box
                className="center"
              >
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
      }
    </>
  );
}