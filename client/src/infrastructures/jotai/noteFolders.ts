import { atom } from 'jotai';
import { fetchNoteFoldersByUIDAndParentNFID } from '../services/noteFolders';
import { TNoteFoldersData } from '@/@types/notefolders';

export const foldersAtom = atom<TNoteFoldersData[]>([]);

export interface FolderObjType {
  UID: number;
  PNFID: number;
}

export const getFoldersAtom = atom(null, async (_get, set, obj: FolderObjType) => {
  const foldersData: TNoteFoldersData[] = await fetchNoteFoldersByUIDAndParentNFID(
    obj.UID,
    obj.PNFID,
  );
  set(foldersAtom, foldersData);
  return foldersData;
})