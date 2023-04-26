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
import { Box, Typography } from "@mui/material";
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
      <Box sx={{ width: "48%", height: "30vh" }}>
        <Typography component="div">
          <Box className="big-white-text center">
            {title}
          </Box>
        </Typography>
        <Spacer size={8} axis="vertical" />
        <Box sx={{ position: "relative" }}>
          <Typography component="div">
            <Box className="absolute-center-text white-text text-center doughnut-graph-title">
              {Math.round(pressureValue*100)/100}
            </Box>
          </Typography>
          <Doughnut
            data={graphData}
            options={doughnutOptions}
            className="doughnats"
            id="chart-key"
          />
        </Box>
      </Box>
    </>
  );
}