import { atom, useAtom } from 'jotai';
import { atomWithReset, useResetAtom } from 'jotai/utils'


/**
 * @description
 * 描画モードを保持
**/
export const drawModeAtom = atom<"pen" | "strokeErase">("pen");

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


/**
 * @description
 * stroke消しゴムによって削除したログ
 * @params
 * 要素がfalseなら普通のpen
**/
export const isEraseStroke = atom<any[]>([]);


/**
 * @description
 * undo系
**/
const undoStrokeLogAtom = atom<any[]>([]);

// undoしたストロークを追加
export const setUndoStrokeLogAtom = atom(null, (get, set, val) => {
  set(undoStrokeLogAtom, get(undoStrokeLogAtom).concat([val]));
})

// undoしたログを空にするAtom
export const clearUndoStrokeLogAtom = atom(null, (_get, set) => {
  set(undoStrokeLogAtom, []);
})

// redo可能かを返す
export const redoableAtom = atom((get) => {
  return get(undoStrokeLogAtom).length > 0 ? true: false;
})


/**
 * @description
 * redo この後に
 * drawer.numOfStroke = drawer.numOfStroke + 1;
 * setDrawer(drawer);
 * drawer.reDraw();
 * を実行
**/
export const redoAtom = atom((get) => {get(undoStrokeLogAtom)}, (get, set) => {
  get(drawerAtom).currentFigure.add(
    get(undoStrokeLogAtom)[get(undoStrokeLogAtom).length-1]
  );
  
  set(undoStrokeLogAtom, get(undoStrokeLogAtom).slice(0, -1));
  set(drawerNumOfStrokeAtom, get(drawerNumOfStrokeAtom)+1);
})