import React from "react";

export interface PostNoteFolderType {
  UID: number;
  Name: string;
  ParentNFID: number;
}

export interface NoteFoldersDataType {
  ID: number;
  UID: number;
  Name: string;
  ParentNFID: number;
  CreatedAt: string;
}

export interface AddFolderDialogProps {
  open: boolean;
  closeDialog: () => void;
  setNoteFoldersData: React.Dispatch<React.SetStateAction<NoteFoldersDataType[]>>
}