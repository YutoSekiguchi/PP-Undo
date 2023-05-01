export const getMinimumPoints = (arrays: any[]) => {
  const minimums = [];
  for (let i = 1; i < 5; i++) {
    let minimum = i < 3 ? arrays[0][i]: arrays[1][i];
    for (let j = 1; j < arrays.length; j++) {
      if (arrays.length < i) {continue;}
      if (arrays[j][i] < minimum) {
        minimum = arrays[j][i];
      }
    }
    minimums.push(minimum);
  }
  return {
    left: Math.min(minimums[0], minimums[2]),
    top: Math.min(minimums[1], minimums[3])
  };
}