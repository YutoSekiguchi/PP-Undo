import { TNoteData } from '@/@types/notefolders';
import { atom } from 'jotai';
import { fetchNotesByNFIDAndUID } from '../services/note';

export const myNoteAtom = atom<TNoteData | null>(null);
export const notesAtom = atom<TNoteData[]>([]);

export const getNotesByNFIDAndUIDAtom = atom(null, async (_get, set, obj: {UID: number, PNFID: number}) => {
  const notesData: TNoteData[] = await fetchNotesByNFIDAndUID(obj.PNFID, obj.UID);
  set(notesAtom, notesData);
  return notesData;
});
