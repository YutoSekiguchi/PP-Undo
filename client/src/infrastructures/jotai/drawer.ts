import { atom, useAtom, useSetAtom } from 'jotai';

/**
@description
drawerを保持
**/
export const drawerAtom = atom<any>({});

/**
@description
ストローク量を保持
**/
export const drawerNumOfStrokeAtom = atom<number>(0);