import { StrokeDataType } from '@/@types/note';
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
 * undo系
**/
const undoStrokeLogAtom = atom<any[]>([]);

// undoしたストロークを追加
export const setUndoStrokeLogAtom = atom(null, (get, set, obj: {"stroke": any, "pressure": number}) => {
  set(undoStrokeLogAtom, get(undoStrokeLogAtom).concat([obj]));
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
 * ストロークごとの筆圧を保持
 */
export const avgPressureOfStrokeAtom = atom<number[]>([]);
// 追加処理
export const addAvgPressureOfStrokeAtom = atom(null, (get, set, val: number) => {
  set(avgPressureOfStrokeAtom, get(avgPressureOfStrokeAtom).concat([val]));
})
// 削除処理
export const removeAvgPressureOfStrokeAtom = atom(null, (get, set, values: number | number[]) => {
  let tmp: number[] = [];
  get(avgPressureOfStrokeAtom).map((val, i) => {
    if (typeof values == "number") {
      if (i != values) {
        tmp.push(val);
      }
    } else {
      if (!values.includes(i)) {
        tmp.push(val);
      }
    }
  });
  set(avgPressureOfStrokeAtom, tmp);
})
// 空にする処理
export const clearAvgPressureOfStrokeAtom = atom(null, (_get, set) => {
  set(avgPressureOfStrokeAtom, [])
})
// PPUndoグラフ用に筆圧とストロークの長さを返す
export const getAvgPressureOfStrokeCountAtom = atom((get) => {
  let tmp: number[] = [...Array(21)].fill(0);
  get(avgPressureOfStrokeAtom).map((pressure, _) => {
    const j = Math.round(pressure*100)/100;
    tmp[Math.ceil(j*20)] += 1
  })
  return tmp;
})

/**
 * @description
 * PPUndoのバーの値を保持
 */
export const sliderValueAtom = atom<number | number[]>(0);


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
    get(undoStrokeLogAtom)[get(undoStrokeLogAtom).length-1]["stroke"]
  );
  set(avgPressureOfStrokeAtom, get(avgPressureOfStrokeAtom).concat([get(undoStrokeLogAtom)[get(undoStrokeLogAtom).length-1]["pressure"]]));
  set(undoStrokeLogAtom, get(undoStrokeLogAtom).slice(0, -1));
  set(drawerNumOfStrokeAtom, get(drawerNumOfStrokeAtom)+1);
})


/**
 * @description
 * PP-Undo前の状態のログ
 */
export const logOfBeforePPUndoAtom = atom<StrokeDataType[]>([])

export const addLogOfBeforePPUndoAtom = atom(null, (get, set, strokeData: StrokeDataType) => {
  set(logOfBeforePPUndoAtom, get(logOfBeforePPUndoAtom).concat([strokeData]));
})