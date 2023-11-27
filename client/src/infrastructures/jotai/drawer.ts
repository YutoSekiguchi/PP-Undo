import { atom } from 'jotai';
import { TLogStrokeData } from '@/@types/note';
import { SPLIT_PRESSURE_COUNT } from '@/configs/PPUndoGraphConifig';


/**
 * @description
 * 描画モードを保持
**/
export const drawModeAtom = atom<"pen" | "strokeErase" | "pointer" | "pressureStrokeErase">("pen");

/**
 * @description
 * 全体のGroupの可視化の表示管理
 */
export const isShowAllGroupBoxAtom = atom<boolean>(false);

/**
 * @description
 * デモかどうか
 */
export const isDemoAtom = atom<boolean>(false);

/**
 * @description
 * 描画履歴の保持
**/
export const historyAtom = atom<any[]>([]);
// undoしたストロークを追加
export const addHistoryAtom = atom(null, (get, set, obj: { "type": string, "strokes": any[] }) => {
  set(historyAtom, get(historyAtom).concat([obj]));
})
export const historyForRedoAtom = atom<any[]>([]);
export const addHistoryForRedoAtom = atom(null, (get, set, obj: { "type": string, "strokes": any[] }) => {
  set(historyForRedoAtom, get(historyForRedoAtom).concat([obj]));
})
/**
 * @description
 * PP-Undo前の状態のログ
 */
export const logOfBeforePPUndoAtom = atom<TLogStrokeData[]>([])

export const addLogOfBeforePPUndoAtom = atom(null, (get, set, strokeData: TLogStrokeData) => {
  set(logOfBeforePPUndoAtom, get(logOfBeforePPUndoAtom).concat([strokeData]));
})

export const backgroundImageAtom = atom<string>("");
/**
 * @description
 * ストロークごとの筆圧を保持
 */
// 表示されているストロークの筆圧
export const avgPressureOfStrokeAtom = atom<number[]>([]);
// 削除したものも含めた筆圧
export const allAvgPressureOfStrokeAtom = atom<number[]>([]);
// 追加処理
export const addAvgPressureOfStrokeAtom = atom(null, (get, set, val: number) => {
  set(avgPressureOfStrokeAtom, get(avgPressureOfStrokeAtom).concat([val]));
  set(allAvgPressureOfStrokeAtom, get(allAvgPressureOfStrokeAtom).concat([val]));
})
/**
   * @description
   * ログRedo系統のAtom
   */
export const logRedoCountAtom = atom<number>(0);
  
/**
 * @description
 * PP-Undoをした回数を保持
 */
export const ppUndoCountAtom = atom<number>(0);

/**
 * @description
 * 新規ログの件数通知
 */
export const logNotifierCountAtom = atom<number>(0);

/**
 * @description
 * undo回数
 */
export const undoCountAtom = atom<number>(0);

export const plusUndoCountAtom = atom(null, (get, set) => {
  set(undoCountAtom, get(undoCountAtom) + 1);
});

/**
 * @description
 * redo回数
 */
export const redoCountAtom = atom<number>(0);

export const plusRedoCountAtom = atom(null, (get, set) => {
  set(redoCountAtom, get(redoCountAtom) + 1);
});

export const noteAspectRatiotAtom = atom<number>(1);

export const basisPressureAtom = atom<number>(0);


/**
 * @description
 * 1ストロークの筆圧を保持
 */
export const pressureOfOneStrokeAtom = atom<number[]>([]);
export const addPressureOfOneStrokeAtom = atom(null, (get, set, val: number) => {
  set(pressureOfOneStrokeAtom, get(pressureOfOneStrokeAtom).concat([val]));
})
export const clearPressureOfOneStrokeAtom = atom(null, (_get, set) => {
  set(pressureOfOneStrokeAtom, []);
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
  let tmp: number[] = [...Array(SPLIT_PRESSURE_COUNT + 1)].fill(0);
  get(avgPressureOfStrokeAtom).map((pressure, _) => {
    const j = Math.round(pressure*100)/100;
    tmp[Math.ceil(j*SPLIT_PRESSURE_COUNT)] += 1
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
 * 過去の筆圧Groupの保持
 */
export const historyGroupPressureAtom = atom<number[]>([]);
// 追加処理
export const addHistoryGroupPressureAtom = atom(null, (get, set, val: number) => {
  set(historyGroupPressureAtom, [val].concat(get(historyGroupPressureAtom)));
})

export const getPressureModeAtom = atom<"avg" | "transform">("avg");

export const nowPointPressureAtom = atom<number>(0);

export const waveCountAtom = atom<number>(0);

export const pointerXAtom = atom<number>(0);
export const pointerYAtom = atom<number>(0);

/**
 * @description
 * リセット
 */
export const resetAtom = atom(null, (_get, set) => {
  set(undoCountAtom, 0);
  set(redoCountAtom, 0);
  set(logRedoCountAtom, 0);
  set(ppUndoCountAtom, 0);
  set(logNotifierCountAtom, 0);
  set(historyAtom, []);
  set(historyForRedoAtom, []);
  set(avgPressureOfStrokeAtom, []);
  set(historyGroupPressureAtom, []);
  set(basisPressureAtom, 0);
})