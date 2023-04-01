import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { LoginDialogPropsType } from "@/@types/authentication";
import { userDataAtom, loginAtom, signinAtom } from "@/infrastructures/jotai/authentication";
import Spacer from "../Spacer";


export const LoginDialog: React.FC<LoginDialogPropsType> = (props) => {
  const { closeLoginDialog } = props;
  const [, signin] = useAtom(signinAtom);
  const [, login] = useAtom(loginAtom);
  const [userData, ] = useAtom(userDataAtom);

  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const closeDialog = () => {
    closeLoginDialog();
  }

  const changeUserName = (event: any) => {
    setUserName(event.target.value);
  }
  
  const changePassword = (event: any) => {
    setPassword(event.target.value);
  }

  const checkTextField = () => {
    if(userName === "") {
      setErrorMessage("ユーザ名を入力してください");
    } else if (password === "") {
      setErrorMessage("パスワードを入力してください");
    }
  }

  const clickSigninButton = async () => {
    checkTextField();
    const res = await signin({
      userName: userName,
      password: password,
    });
    if (res == null) {
      setErrorMessage("このユーザは既に存在します");
    } else {
      closeDialog();
    }
  }

  const clickLoginButton = async () => {
    checkTextField();
    const res = await login({
      userName: userName,
      password: password,
    })
    if (res == null) {
      setErrorMessage("このユーザは存在しません。")
    } else {
      closeDialog();
    }
  }

  return (
    <Box className="login-dialog-container">
      <Box className="width100 login-dialog-wrapper">
        <Box className="login-dialog">
          <Typography className="login-dialog-title">LOGIN</Typography>
          {
            errorMessage != null
            ? <Alert severity="error">{errorMessage}</Alert>
            : <Spacer size={45}  />
          }
          <TextField
            className="text-field"
            label="User Name"
            variant="filled"
            color="info"
            onChange={changeUserName}
            focused
          />
          <TextField
            className="text-field"
            label="Password"
            variant="filled"
            color="info"
            onChange={changePassword}
            focused
          />
          <Box className="signin-wrapper">
            <Button
              variant="contained"
              color="primary"
              onClick={clickSigninButton}
            >
              ＋このユーザ名とパスワードで新規登録
            </Button>
          </Box>
          <Box className="buttons">
            <Button
              variant="outlined"
              color="info"
              onClick={closeDialog}
            >
              閉じる
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={clickLoginButton}
            >
              ログイン
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}