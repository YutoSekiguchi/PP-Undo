export interface AddFolderDialogProps {
  open: boolean;
  closeDialog: () => void;
}

export interface PostNoteFolderType {
  UID: number;
  Name: string;
  ParentNFID: number;
}