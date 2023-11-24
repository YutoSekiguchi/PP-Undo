export const isLineSegmentIntersecting = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number) => {
  // 各線分のベクトルを計算
  const dx1 = x2 - x1;
  const dy1 = y2 - y1;
  const dx2 = x4 - x3;
  const dy2 = y4 - y3;

  // ベクトルの外積を計算
  const delta = dx1 * dy2 - dy1 * dx2;

  // 線分が平行の場合、交差していない
  if (delta === 0) {
    return false;
  }

  // パラメータs, tを計算
  const s = (dx2 * (y1 - y3) - dy2 * (x1 - x3)) / delta;
  const t = (dx1 * (y1 - y3) - dy1 * (x1 - x3)) / delta;

  // 交差条件の判定
  return (0 <= s && s <= 1) && (0 <= t && t <= 1);
}