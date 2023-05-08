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
// import { PPUndoGraphDatasetsConfigType } from "@/@types/note";
// import { datasetsConfig, options } from "@/configs/NowPressureLineGraphConfig";
// import { useAtom } from "jotai";
// import { pressureOfOneStrokeAtom } from "@/infrastructures/jotai/drawer";

// export const NowPressureGraphArea: React.FC = () => {
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

//   interface dataType {
//     data: number[];
//   }
//   interface datasetsType extends PPUndoGraphDatasetsConfigType, dataType {};
//   interface graphDataType {
//     labels: number[];
//     datasets: datasetsType[];
//   }

//   const [pressureOfOneStroke, ] = useAtom(pressureOfOneStrokeAtom); 

//   const graphData: graphDataType = {
//     labels: [...Array(pressureOfOneStroke.length).keys()],
//     datasets: [
//       {
//         ...datasetsConfig, ...{data: pressureOfOneStroke,}
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