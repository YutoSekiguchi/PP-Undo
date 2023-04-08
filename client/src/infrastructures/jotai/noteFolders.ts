import { atom } from 'jotai';
import { fetchNoteFoldersByUIDAndParentNFID } from '../services/noteFolders';
import { NoteFoldersDataType } from '@/@types/notefolders';

export const foldersAtom = atom<NoteFoldersDataType[]>([]);

export interface FolderObjType {
  UID: number;
  PNFID: number;
}

export const getFoldersAtom = atom(null, async (_get, set, obj: FolderObjType) => {
  const foldersData: NoteFoldersDataType[] = await fetchNoteFoldersByUIDAndParentNFID(
    obj.UID,
    obj.PNFID,
  );
  set(foldersAtom, foldersData);
  return foldersData;
})