export const confirmNumberArrayFromString = (str: string) => {
  const ary = str.split(',');
  return ary.map(Number);
}