import React from "react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
//   ArcElement
// } from 'chart.js'
// import { Line } from "react-chartjs-2";
// import { Box } from "@mui/material";
// import { TPPUndoGraphDatasetsConfig } from "@/@types/note";
// import { datasetsConfig, options } from "@/configs/AvgPressureLineGraphConfig";
// import { useAtom } from "jotai";
// import { avgPressureOfStrokeAtom } from "@/infrastructures/jotai/drawer";

// export const AvgPressureGraphArea: React.FC = () => {
//   ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend,
//     Filler,
//     ArcElement
//   )
//   ChartJS.defaults.scales.linear.min = 0;

//   interface TData {
//     data: number[];
//   }
//   interface TDatasets extends TPPUndoGraphDatasetsConfig, TData {};
//   interface TGraphData {
//     labels: number[];
//     datasets: TDatasets[];
//   }

//   const [avgPressureOfStroke, ] = useAtom(avgPressureOfStrokeAtom);

//   const graphData: TGraphData = {
//     labels: [...Array(avgPressureOfStroke.length).keys()],
//     datasets: [
//       {
//         ...datasetsConfig, ...{data: avgPressureOfStroke,}
//       }
//     ]
//   }

//   return (
//     <>
//       <Box className="center">
//         <Line
//           className="graph"
//           height={125}
//           data={graphData}
//           options={options}
//           id="chart-key"
//         />
//       </Box>
//     </>
//   );
// }