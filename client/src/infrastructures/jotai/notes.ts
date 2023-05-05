import { NoteDataType } from '@/@types/notefolders';
import { atom } from 'jotai';
import { fetchNotesByNFIDAndUID } from '../services/note';

export const myNoteAtom = atom<NoteDataType | null>(null);
export const notesAtom = atom<NoteDataType[]>([]);

export const getNotesByNFIDAndUIDAtom = atom(null, async (_get, set, obj: {UID: number, PNFID: number}) => {
  const notesData: NoteDataType[] = await fetchNotesByNFIDAndUID(obj.PNFID, obj.UID);
  set(notesAtom, notesData);
  return notesData;
});
