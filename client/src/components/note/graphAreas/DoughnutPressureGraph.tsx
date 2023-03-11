import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { Box } from "@mui/material";
import { DoughnutGraphConfigType, DoughnutPressureGraphPropsType } from "@/@types/note";
import { doughnutOptions } from "@/configs/DoughnutPressureGraphConfig";
import Spacer from "@/components/common/Spacer";

export const DoughnutPressureGraph: React.FC<DoughnutPressureGraphPropsType> = (props) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
  )
  ChartJS.defaults.scales.linear.min = 0;

  interface dataType {
    data: number[];
  }
  interface datasetsType extends DoughnutGraphConfigType, dataType {};
  interface graphDataType {
    labels: string[];
    datasets: datasetsType[];
  }

  const { pressureValue, title, graphLabel, datasetsConfig } = props;

  const graphData: graphDataType = {
    labels: graphLabel,
    datasets: [
      {
        ...datasetsConfig,
        ...{data: [pressureValue, 1-pressureValue]}
      }
    ]
  }

  return (
    <>
      <Box sx={{ width: "48%" }}>
        <p className="big-text text-center">{title}</p>
        <Spacer size={8} axis="vertical" />
        <Box sx={{ position: "relative" }}>
          <p className="absolute-center-text text text-center">{Math.round(pressureValue*100)/100}</p>
          <Doughnut
            data={graphData}
            options={doughnutOptions}
            id="chart-key"
          />
        </Box>
      </Box>
    </>
  );
}