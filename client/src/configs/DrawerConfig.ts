export const DrawerConfig = {
  "pointRadius": { // 点の半径
    "originalPoint": 1.5,
    "spline": 1.5,
    "dft": 1.5
  },
  "strokeWidth": { // 描線の太さ
    "originalPath": 1.5,
    "spline": 1.5,
    "dft": 1.5
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
    type: "plain",
    lines: {
      color: "#C8C8C8",
      padding: {
        top: 70,
        bottom: 10,
        left: 50,
        right: 50
      },
      strokeWidth: 2,
      margin: 120
    },
    backgroundColor: "#fff"
  }
};