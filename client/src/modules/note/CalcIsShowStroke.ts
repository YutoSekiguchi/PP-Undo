export const calcIsShowStrokeList = (strokes: any[]) => {
  let tmp: number[] = [];
  strokes.map((stroke, i) => {
    const color: string = stroke.color;
    if (color.length == 9 && color.endsWith('00')) {
      tmp.push(0);
    } else {
      tmp.push(1);
    }
  })

  return tmp;
}

export const calcIsShowStrokeCount = (strokes: any[]) => {
  let tmp: number = 0;
  strokes.map((stroke, i) => {
    const color: string = stroke.color;
    if (!(color.length == 9 && color.endsWith('00'))) {
      tmp += 1;
    }
  })

  return tmp;
}