export const rgbToHex = (rgbString: string) => {
  const values = rgbString.substring(4, rgbString.length - 1).split(",");
  const red = parseInt(values[0].trim());
  const green = parseInt(values[1].trim());
  const blue = parseInt(values[2].trim());
  
  const hex = ((red << 16) | (green << 8) | blue).toString(16);
  return "#" + hex.padStart(6, '0');
}