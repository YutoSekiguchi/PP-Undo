export const isLineSegmentIntersecting = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number) => {
  //交差判定
  const ta = (x3 - x4) * (y1 - y3) + (y3 - y4) * (x3 - x1);
  const tb = (x3 - x4) * (y2 - y3) + (y3 - y4) * (x3 - x2);
  const tc = (x1 - x2) * (y3 - y1) + (y1 - y2) * (x1 - x3);
  const td = (x1 - x2) * (y4 - y1) + (y1 - y2) * (x1 - x4);
  return ta * tb < 0 && tc * td < 0;
}