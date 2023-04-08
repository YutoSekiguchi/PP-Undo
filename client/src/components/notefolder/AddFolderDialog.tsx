import { AddFolderDialogProps } from "@/@types/notefolders";
import { getFoldersAtom } from "@/infrastructures/jotai/noteFolders";
import { addNoteFolder } from "@/infrastructures/services/noteFolders";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useAtom } from "jotai";
import lscache from "lscache";
import React, { useState } from "react";
import { Params, useParams } from "react-router-dom";

export const AddFolderDialog: React.FC<AddFolderDialogProps> = (props) => {
  const { open, closeDialog, setNoteFoldersData } = props;
  const params: Params<string> = useParams();
  const [title, setTitle] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [, getFolders] = useAtom(getFoldersAtom);

  const handleChangeTitle = (event: any) => {
    setTitle(event.target.value);
  }

  const addFolder = async () => {
    if (title === "") {
      setErrorMessage("タイトルは一文字以上入力してください");
      return;
    }
    const userData = lscache.get('loginUserData');
    const uid = Number(userData.ID);
    const pnfid = Number(params.pnfid);
    await addNoteFolder({
      UID: uid,
      Name: title,
      ParentNFID: pnfid,
    });
    setNoteFoldersData(await getFolders({
      UID: uid,
      PNFID: pnfid
    }));
    closeDialog();
  }
  
  return (
    <>
      <Dialog
        open={open}
        onClose={closeDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>
          のタイトルを入力してください。
        </DialogTitle>
        <DialogContent>
          {
            errorMessage != null
            && <Alert severity="error">{errorMessage}</Alert>
          }
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleChangeTitle}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={addFolder}>作成</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}