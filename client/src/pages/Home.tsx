import { userDataAtom } from "@/infrastructures/jotai/authentication";
import { isAuth } from "@/modules/common/isAuth";
import { Box, Button, Typography } from "@mui/material";
import { useAtom } from "jotai";
import lscache from "lscache";
import { useState } from "react";
import { AccountCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { LoginDialog } from "@/components/common/authentication/LoginDialog";
import { APP_NAME } from "@/configs/settings";

export const Home: () => JSX.Element = () => {
  const navigate = useNavigate();

  const [loginUserData, ] = useAtom(userDataAtom);
  const [isLoginDialog, setIsLoginDialog] = useState<boolean>(false);

  const toNoteFoldersPage = () => {
    navigate("/notefolders/0");
  }

  const openLoginDialog = () => {
    setIsLoginDialog(true);
  }

  const closeLoginDialog = () => {
    setIsLoginDialog(false);
  }

  const WelcomeBody: () => JSX.Element = () => {
    return (
      <>
        {
          isAuth() || loginUserData != null 
          ? <>
            <AccountCircle sx={{ fontSize: 250 }} />
            <Typography variant="h5">
              ようこそ、{(lscache.get('loginUserData') && isAuth())? lscache.get('loginUserData').Name: ''} さん
            </Typography>
          </>
          : <>
            <Box className="no-login-welcome">
              <Typography variant="h5">
                ようこそ<br />ログインして{APP_NAME}を使ってみましょう!!
              </Typography>
            </Box>
          </>
        }
      </>
    );
  }

  const LoginDetail: () => JSX.Element = () => {
    return (
      <>
        <Typography variant="body2" color="#888">
          {APP_NAME}を使用して快適なデジタル手書きを経験しましょう
        </Typography>
        <Button
          color="primary"
          onClick={toNoteFoldersPage}
        >
          マイフォルダに移動
        </Button>
      </>
    );
  }

  const Footer: () => JSX.Element = () => {
    const date = new Date();
    return (
      <>
        <Box className="home-footer welcome">
          <Typography className="copyright" variant="body2" color="#888">
            &copy; {date.getFullYear()} YutoSekiguchi
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <Box className="home-body">
        {isLoginDialog &&
          <>
            <LoginDialog
              closeLoginDialog={closeLoginDialog}
            />
          </>
        }
        <Box className="welcome my">
          <WelcomeBody />
        </Box>
        {
          isAuth() || loginUserData != null
          ? <>
            <Box className="welcome">
              <LoginDetail />
            </Box>
          </>
          : <>
            <Box className="welcome">
              <Button 
                variant="outlined"
                color="primary"
                onClick={openLoginDialog}
              >
                Login
              </Button>
            </Box>
          </>
        }
        <Footer />
      </Box>
    </>
  );
}