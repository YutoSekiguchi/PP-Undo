export const averagePressure = (li: number[]) => {
  if (li.length == 0) { return 0; }
  let sum = 0;
  for (let i=0; i<li.length; i++) {
    sum += li[i];
  }

  return sum/li.length;
}