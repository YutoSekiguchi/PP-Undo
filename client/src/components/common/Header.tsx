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
import { TUserData } from "@/@types/authentication";
import lscache from "lscache";
import { isAuth } from "@/modules/common/isAuth";
import { APP_NAME } from "@/configs/settings";

export const Header:React.FC =() => {
  const location: Location = useLocation();

  const [isLoginDialog, setIsLoginDialog] = useState<boolean>(false);
  const [userData, setUserData] = useState<TUserData | null>(null);
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
        <Box className="header">
          <Paper sx={{ background: "#F2F6FC", borderBottom: '1px solid #F2F6FC' }} elevation={0}  >
            <Toolbar sx={{ justifyContent: "space-between" }}>
              <Box
                className="center"
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
                  {APP_NAME}
                </Typography>
              </Box>
              
              {
                isAuth()
                  ? <Box className="align-center pointer">
                    <Person />
                    <Typography>
                      {userData!=null? userData.Name: ''}<span className="small-text">さん</span>
                    </Typography>
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