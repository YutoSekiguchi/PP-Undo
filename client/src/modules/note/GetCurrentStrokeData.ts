export const getCurrentStrokeData = async (strokes: any[]) => {
  const tmp: any[] = [];
  strokes?.map((stroke: any, i: number) => {
    const data = {
      DFT: "",
      color: stroke.color,
      originalLength: stroke.originalLength,
      stime: stroke.stime,
      strokeWidth: stroke.strokeWidth,
      points: stroke.points,
      spline: "",
      svg: "",
    }
    tmp.push(data);
  });
  return {"Strokes": tmp};
}