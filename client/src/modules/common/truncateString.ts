export const truncateString = (str: string, maxLength: number = 10) => {
  if (str.length > maxLength) {
    return str.slice(0, maxLength - 1) + '…';
  }
  return str;
}