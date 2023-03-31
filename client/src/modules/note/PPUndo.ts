export const getStrokesIndexWithLowPressure = (avgPressureOfStroke: number[], newSliderValue: number | number[]) => {
  let tmp: number[] = [];
  avgPressureOfStroke.map((pressure, i) => {
    if(typeof newSliderValue == "number" && Math.round(pressure*100)/100 <= newSliderValue) {
      tmp.push(i);
    }
  })
  return tmp;
}

export const reduceStrokeColorOpacity = (newLowerPressureIndexList: number[], strokes: any[]) => {
  newLowerPressureIndexList.map(val => {
    const color = strokes[val].color;
    if(color.length == 7) {
      strokes[val].color = color + "22";
    }
  })
}

export const increaseStrokeColorOpacity = (lowerPressureIndexList: number[], newLowerPressureIndexList: number[], strokes: any[]) => {
  lowerPressureIndexList.map(val => {
    const color = strokes[val].color;
    if (!newLowerPressureIndexList.includes(val) && color.length == 9 && color.slice(-2) != "00") {
      strokes[val].color = color.slice(0, -2);
    }
  })
}

export const hideLowPressureStrokes = (lowerPressureIndexList: number[], strokes: any[]) => {
  lowerPressureIndexList.map(val => {
    const color = strokes[val].color;
    if (color.length == 9) {
      strokes[val].color = color.slice(0, -2) + "00";
    } else if (color.length == 7) {
      strokes[val].color = color + "00";
    }
  })
}