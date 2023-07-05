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
import { TDoughnutGraphConfig, TDoughnutPressureGraphProps } from "@/@types/note";
import { doughnutOptions } from "@/configs/DoughnutPressureGraphConfig";

export const DoughnutPressureGraph: React.FC<TDoughnutPressureGraphProps> = (props) => {
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

  interface TData {
    data: number[];
  }
  interface TDatasets extends TDoughnutGraphConfig, TData {};
  interface TGraphData {
    labels: string[];
    datasets: TDatasets[];
  }

  const { pressureValue, title, graphLabel, datasetsConfig } = props;

  const graphData: TGraphData = {
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
        <Box className="white-text center">
          <Typography fontSize={12} fontWeight="bold">
            {title}
          </Typography>
        </Box>
        <Box sx={{ position: "relative", width: "100%" }} className="center">
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