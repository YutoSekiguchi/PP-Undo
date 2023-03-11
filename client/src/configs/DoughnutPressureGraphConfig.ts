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
  backgroundColor:  ["rgba(75, 192, 192, 1)", "rgba(0, 0, 0, 0)"],
  borderColor: "rgba(75, 192, 192, 0.1)",
}
export const avgDatasetsConfig: DoughnutGraphConfigType = {
  backgroundColor: ["rgba(192, 75, 192, 1)", "rgba(0, 0, 0, 0)"],
  borderColor: "rgba(192, 75, 192, 0.1)",
}

export const doughnutOptions: {} =
{
  plugins: {
    legend:{
      display:false,
    },
  },
  cutout: 40,
  maintainAspectRatio: false,
};