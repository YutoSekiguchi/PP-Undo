export const averagePressure = (li: number[]) => {
  let sum = 0;
  for (let i=0; i<li.length; i++) {
    sum += li[i];
  }

  return sum/li.length;
}