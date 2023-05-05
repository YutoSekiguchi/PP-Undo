const defaultWidth: number = 1.5;

export const DrawerConfig = {
  "pointRadius": { // 点の半径
    "originalPoint": defaultWidth,
    "spline": defaultWidth,
    "dft": defaultWidth
  },
  "strokeWidth": { // 描線の太さ
    "originalPath": defaultWidth,
    "spline": defaultWidth,
    "dft": defaultWidth
  },
  "colors": { // 描線の色
    "originalPoint": "#00000000",
    "originalPath": "#00ff0000",
    "point": "#0000ff00",
    "spline": "#00ffff00",
    "dft": "#ffffff00",
    "onion": {
      "current": "rgba(30, 100, 100, 0)",
      "others": "rgba(0, 100, 100, 0)"
    }
  },
  drawer: {
    type: "lined",
    lines: {
      color: "#C8C8C8",
      padding: {
        top: 70,
        bottom: 10,
        left: 50,
        right: 50
      },
      strokeWidth: 1,
      margin: 50
    },
    backgroundColor: "#fff"
  }
};