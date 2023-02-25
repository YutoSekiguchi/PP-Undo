import { PPUndoGraphDatasetsConfigType } from "@/@types/note";

export const xLabels: number[] = [...Array(21)].map((_, i) => Math.round((i*0.05)*100)/100);

export const datasetsConfig: PPUndoGraphDatasetsConfigType = {
  label: "筆圧",
  borderColor: "#cc66ff",
  backgroundColor: "#0003",
  fill: true,
}

export const options: {} = {
  maintainAspectRatio: false,
  plugins: {
    legend:{
      display:false,
    },
  },
  scales: {
    // x: {
    //   display: true
    // },
    // y: {
    //   display: false
    // },
  },
}