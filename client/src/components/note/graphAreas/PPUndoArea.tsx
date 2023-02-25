import React from "react";
import { useAtom } from 'jotai'
import { avgPressureOfStrokeAtom, getAvgPressureOfStrokeCountAtom } from "@/infrastructures/jotai/drawer";
import {
  Chart as ChartJS,
  ChartData,
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
import { Line } from "react-chartjs-2";
import {
  Box, Typography 
} from "@mui/material";
import Spacer from "@/components/common/Spacer";
import { PPUndoGraphDatasetsConfigType } from "@/@types/note";
import { datasetsConfig, options, xLabels } from "@/configs/PPUndoGraphConifig";


export const PPUndoArea: React.FC = () => {
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
  interface datasetsType extends PPUndoGraphDatasetsConfigType, dataType {};
  interface graphDataType {
    labels: number[];
    datasets: datasetsType[];
  }

  // const [data, ] = useAtom(avgPressureOfStrokeAtom);
  const data = useAtom(getAvgPressureOfStrokeCountAtom)[0];

  const graphData: graphDataType = {
    labels: xLabels,
    datasets: [
      { ...datasetsConfig, ...{data: data,} },
    ],
  };

	return (
    <>
      <Box className="graph-wrapper">
        <p className="big-text center">PPUndo</p>
        <Spacer size={6} />
        <Box className="center">
          <Line
            className="graph"
            height={200}
            data={graphData}
            options={options}
            id="chart-key"
          />
        </Box>
      </Box>
    </>
	);
}