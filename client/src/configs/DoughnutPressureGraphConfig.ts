import { DoughnutGraphConfigType } from "@/@types/note";

export const nowGraphLabel: string[] = [
  "現在の筆圧",
  "None"
];
export const avgGraphLabel: string[] = [
  "今までの筆圧の平均",
  "None"
]

export const nowDatasetsConfig: DoughnutGraphConfigType = {
  backgroundColor:  ["#7ff", "rgba(0, 0, 0, 0.8)"],
  borderColor: "#7ff3",
}
export const avgDatasetsConfig: DoughnutGraphConfigType = {
  backgroundColor: ["#0fa", "rgba(0, 0, 0, 0.8)"],
  // backgroundColor: ["#e5289e", "rgba(0, 0, 0, 0.8)"],
  borderColor: "#0fa3",
}

export const doughnutOptions: {} =
{
  plugins: {
    legend:{
      display:false,
    },
  },
  cutout: 45,
  radius: "90%",
  maintainAspectRatio: false,
  animation: {
    animateScale: true,
  }
};