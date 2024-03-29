export const distanceFromPointToLine = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) => {
  // 直線上の点を求める
  const m = (y3 - y2) / (x3 - x2); // 傾きを求める
  const b = y2 - m * x2; // y切片を求める
  const x = (x1 + m * y1 + m * m * x2 - m * y2) / (1 + m * m);
  const y = (m * x1 + (m * m) * y1 + m * x2 + b * (1 + m * m)) / (1 + m * m);

  // 点と直線上の点との距離を求める
  const distance: number = Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1));

  return distance;
}