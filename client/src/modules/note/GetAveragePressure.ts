import { PRESSURE_ROUND_VALUE } from "@/configs/settings";

export const getAveragePressure = (li: number[]) => {
  if (li.length == 0) { return 0; }
  let sum = 0;
  for (let i=0; i<li.length; i++) {
    sum += li[i];
  }

  return Math.round((sum/li.length) * PRESSURE_ROUND_VALUE) / PRESSURE_ROUND_VALUE;
}