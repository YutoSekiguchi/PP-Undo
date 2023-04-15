import { NoteDataType } from '@/@types/notefolders';
import { atom } from 'jotai';
import { fetchNotesByNFID } from '../services/note';

export const myNoteAtom = atom<NoteDataType | null>(null);
export const notesAtom = atom<NoteDataType[]>([]);

export const getNotesByNFIDAtom = atom(null, async (_get, set, nfid: number) => {
  const notesData: NoteDataType[] = await fetchNotesByNFID(nfid);
  set(notesAtom, notesData);
  return notesData;
});
