export const confirmNumberArrayFromString = (str: string) => {
  if (str === "") { return []; }
  const ary = str.split(',');
  if (ary.length == 0 && str.length > 0) {
    return [Number(str)];
  }
  return ary.map(Number);
}