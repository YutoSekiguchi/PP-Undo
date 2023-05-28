import { SPLIT_PRESSURE_COUNT } from "../PPUndoGraphConifig";
import { namedColor } from "./ColorConfig";

export const xLabels: number[] = [...Array(SPLIT_PRESSURE_COUNT + 1)].map((_, i) => Math.round((i*(1/SPLIT_PRESSURE_COUNT))*100)/100);

export const datasetsConfig = (index: number) => {
  const dsColor = namedColor(index)
  return {
    label: `note ${index + 1}`,
    borderColor: dsColor,
    // backgroundColor: "#9e4c9833",
    // pointBackgroundColor: "#f9fafa",
    // fill: true,
    // smooth: true,
  }
}


export const options: {} = {
  maintainAspectRatio: true,
  scales: {
    x: {
      ticks: {
        color: "#000",
      },
      title: {
        color: "#000",
        display: true,
        text: "筆圧値",
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: "#000",
      },
      title: {
        color: "#000",
        display: true,
        text: "ストローク数",
      }
    }
  },
}


// export const options: {} = {
//   maintainAspectRatio: true,
//   scales: {
//     x: {
//       ticks: {
//         color: "#f9fafa",
//       },
//       title: {
//         color: "#f9fafa",
//         display: true,
//         text: "筆圧値",
//       },
//     },
//     y: {
//       beginAtZero: true,
//       ticks: {
//         color: "#f9fafa",
//       },
//       title: {
//         color: "#f9fafa",
//         display: true,
//         text: "ストローク数",
//       }
//     }
//   },
// }