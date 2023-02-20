import { atom, useAtom, useSetAtom } from 'jotai';

/**
@description
drawerを保持
**/
export const drawerAtom: any = atom({});

export const drawerNumOfStrokeAtom = atom<number>(0);