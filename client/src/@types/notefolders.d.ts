import React from "react";

export interface TPostNoteFolder {
  UID: number;
  Name: string;
  ParentNFID: number;
}

export interface TNoteFoldersData {
  ID: number;
  UID: number;
  Name: string;
  ParentNFID: number;
  CreatedAt: string;
}

export interface TAddFolderDialog {
  type: "folder" | "note";
  open: boolean;
  edit?: {id: number, title: string};
  closeDialog: () => void;
  setNoteFoldersData?: React.Dispatch<React.SetStateAction<NoteFoldersDataType[]>>;
  setNotesData?: React.Dispatch<React.SetStateAction<NoteDataType[]>>;
  setIsChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface TPostNote {
  NFID: number;
  UID: number;
  Title: string;
  Width: number;
  Height: number;
  NoteImage: string;
  StrokeData: any;
  AvgPressure: number;
  AvgPressureList: string;
  AllAvgPressureList: string;
  IsShowStrokeList: string;
  AllStrokeCount: number;
  StrokeCount: number;
  UndoCount: number;
  RedoCount: number;
  LogRedoCount: number;
  PPUndoCount: number;
  SliderValue: number | number[];
  BackgroundImage: string;
}

export interface TNoteData {
  ID: number;
  NFID: number;
  UID: number;
  Title: string;
  Width: number;
  Height: number;
  NoteImage: string;
  StrokeData: any;
  AvgPressure: number;
  AvgPressureList: string;
  AllAvgPressureList: string;
  IsShowStrokeList: string;
  AllStrokeCount: number;
  StrokeCount: number;
  UndoCount: number;
  RedoCount: number;
  LogRedoCount: number;
  PPUndoCount: number;
  SliderValue: number | number[];
  BackgroundImage: string;
  CreatedAt: string;
}