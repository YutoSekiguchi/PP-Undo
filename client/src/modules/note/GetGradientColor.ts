export const getGradientColor = (value: number) => {
  var startColor = [0, 0, 255]; // 青 (#0000ff)
  var endColor = [255, 0, 0]; // 赤 (#ff0000)

  var r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * value);
  var g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * value);
  var b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * value);

  var colorCode = '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
  return colorCode;
}

const componentToHex = (c: number) => {
  var hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
}