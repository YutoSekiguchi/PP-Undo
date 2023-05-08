import { TPPUndoGraphDatasetsConfig } from "@/@types/note";

export const datasetsConfig: TPPUndoGraphDatasetsConfig = {
  label: "筆圧",
  borderColor: "#ffff89",
  backgroundColor: "#fff",
  borderWidth: 2,
  radius: 1,
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
      text: '    every stroke',
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
        text: "ストローク数",
      },
    },
    y: {
      title: {
        display: true,
        text: "筆圧値",
        color: "#f9fafa",
      },
      ticks: {
        color: "#f9fafa",
        min: 0,
        max: 1,
        stepSize: 0.5,
      },
    }
  },
}