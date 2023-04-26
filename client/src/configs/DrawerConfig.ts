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
    "originalPoint": "#000000",
    "originalPath": "#000000",
    "point": "#000000",
    "spline": "#000000",
    "dft": "#000000",
    "onion": {
      "current": "rgba(30, 100, 100, 0.1)",
      "others": "rgba(0, 100, 100, 0.05)"
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