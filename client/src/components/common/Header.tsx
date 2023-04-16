import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import Logo from '@/assets/logo.png'
import { Link, useLocation, Location } from "react-router-dom";
import { notShowPathList } from "@/configs/NotShowPath";
import { 
  Box,
  Toolbar,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import { LoginDialog } from "./authentication/LoginDialog";
import { userDataAtom } from "@/infrastructures/jotai/authentication";
import { Person } from "@mui/icons-material";
import { UserDataType } from "@/@types/authentication";
import lscache from "lscache";
import { isAuth } from "@/modules/common/isAuth";

export const Header:React.FC =() => {
  const location: Location = useLocation();

  const [isLoginDialog, setIsLoginDialog] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserDataType | null>(null);
  const [loginUserData, ] = useAtom(userDataAtom);

  const openLoginDialog = () => {
    setIsLoginDialog(true);
  }

  const closeLoginDialog = () => {
    setIsLoginDialog(false);
  }

  useEffect(() => {
    lscache.flushExpired();
    if (lscache.get('loginUserData') && userData == null) {
      setUserData(lscache.get('loginUserData'));
    }
  }, [location.pathname]);

  useEffect(() => {
    if (loginUserData != null) {
      setUserData(loginUserData);
    }
  }, [loginUserData])

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
              
              {
                isAuth()
                  ? <Box className="align-center pointer">
                    <Person />
                    <p className="text">{userData!=null? userData.Name: ''}<span className="small-text">さん</span></p>
                  </Box>
                  : <Button 
                      variant="outlined"
                      color="inherit"
                      onClick={openLoginDialog}
                    >
                      Login
                    </Button>
              }
            </Toolbar>
          </Paper>
          {isLoginDialog &&
            <>
              <LoginDialog
                closeLoginDialog={closeLoginDialog}
              />
            </>
          }
        </Box>
      }
    </>
  );
}