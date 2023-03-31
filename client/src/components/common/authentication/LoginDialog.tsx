import React, { useState } from "react";
import { LogRedoImageDialogProps } from "@/@types/note";
import { useAtom } from "jotai";
import { Box, Button, TextField, Typography } from "@mui/material";
import { LoginDialogPropsType } from "@/@types/authentication";
import Spacer from "../Spacer";


export const LoginDialog: React.FC<LoginDialogPropsType> = (props) => {
  const { closeLoginDialog } = props;

  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  
  const closeDialog = () => {
    closeLoginDialog();
  }

  const changeUserName = (event: any) => {
    setUserName(event.target.value);
  }
  
  const changePassword = (event: any) => {
    setPassword(event.target.value);
  }

  return (
    <Box className="login-dialog-container">
      <Box className="width100 login-dialog-wrapper">
        <Box className="login-dialog">
          <Typography className="login-dialog-title">LOGIN</Typography>
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
          <Box className="buttons">
            <Button
              variant="contained"
              color="primary"
              onClick={closeDialog}
            >
              閉じる
            </Button>
            <Button
              variant="contained"
              color="warning"
            >
              決定
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}