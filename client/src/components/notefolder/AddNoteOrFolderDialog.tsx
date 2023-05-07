import { AddFolderDialogProps } from "@/@types/notefolders";
import { getFoldersAtom } from "@/infrastructures/jotai/noteFolders";
import { getNotesByNFIDAndUIDAtom } from "@/infrastructures/jotai/notes";
import { addNote } from "@/infrastructures/services/note";
import { addNoteFolder } from "@/infrastructures/services/noteFolders";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useAtom } from "jotai";
import lscache from "lscache";
import React, { useState } from "react";
import { Params, useParams } from "react-router-dom";

export const AddNoteOrFolderDialog: React.FC<AddFolderDialogProps> = (props) => {
  const { type, open, closeDialog, setNoteFoldersData, setNotesData } = props;
  const params: Params<string> = useParams();
  const [title, setTitle] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [, getFolders] = useAtom(getFoldersAtom);
  const [, getNotesByNFIDAndUID] = useAtom(getNotesByNFIDAndUIDAtom);

  const handleChangeTitle = (event: any) => {
    setTitle(event.target.value);
  }

  const handleAddFolder = async () => {
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
    setNoteFoldersData!(await getFolders({
      UID: uid,
      PNFID: pnfid
    }));
    closeDialog();
  }

  const handleAddNote = async () => {
    if (title === "") {
      setErrorMessage("タイトルは一文字以上入力してください");
      return;
    }
    const userData = lscache.get('loginUserData');
    const uid = Number(userData.ID);
    const nfid = Number(params.pnfid);
    await addNote({
      NFID: nfid,
      UID: uid,
      Title: title,
      Width: 0,
      Height: 0,
      NoteImage: "",
      StrokeData: {},
      AvgPressure: 0,
      AvgPressureList: "",
      AllAvgPressureList: "",
      IsShowStrokeList: "",
      AllStrokeCount: 0,
      StrokeCount: 0,
      UndoCount: 0,
      RedoCount: 0,
      LogRedoCount: 0,
      PPUndoCount: 0,
      SliderValue: 0,
      BackgroundImage: "",
    });
    setNotesData!(await getNotesByNFIDAndUID({
      UID: uid,
      PNFID: nfid,
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
          {type=="folder"? "フォルダ": "ノート"}のタイトルを入力してください。
        </DialogTitle>
        <DialogContent>
          {
            errorMessage != null
            && <Alert severity="error">{errorMessage}</Alert>
          }
          <TextField
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
          <Button onClick={type=="folder"? () => handleAddFolder(): () => handleAddNote()}>作成</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}