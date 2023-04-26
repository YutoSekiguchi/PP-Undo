import { PPUndoGraphDatasetsConfigType } from "@/@types/note";

export const datasetsConfig: PPUndoGraphDatasetsConfigType = {
  label: "筆圧",
  borderColor: "#dd77dd",
  backgroundColor: "#fff",
  borderWidth: 2,
  radius: 0.5,
  fill: false,
  smooth: true,
  tension: 0,
}

export const options: {} = {
  maintainAspectRatio: false,
  responsive: true,
  animation: false,
  plugins: {
    legend:{
      display:false,
    },
    title: {
      display: true,
      text: '     now stroke',
      color: "#fff",
      font: {
        size: 18
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: "#f9fafa",
      },
      title: {
        color: "#f9fafa",
        display: true,
        text: "時間",
      },
    },
    y: {
      title: {
        color: "#f9fafa",
        display: true,
        text: "筆圧値",
      },
      ticks: {
        min: 0,
        max: 1,
        stepSize: 0.5,
        color: "#f9fafa",
      },
    }
  },
}