import React, { useState } from "react";
import { useAtom } from 'jotai'
import { drawerAtom, getAvgPressureOfStrokeCountAtom, sliderValueAtom } from "@/infrastructures/jotai/drawer";
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
import { Line } from "react-chartjs-2";
import {
  Box,
} from "@mui/material";
import Spacer from "@/components/common/Spacer";
import { PPUndoGraphDatasetsConfigType } from "@/@types/note";
import { PrettoSlider, datasetsConfig, options, xLabels } from "@/configs/PPUndoGraphConifig";


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

  const data: number[] = useAtom(getAvgPressureOfStrokeCountAtom)[0];
  const graphData: graphDataType = {
    labels: xLabels,
    datasets: [
      { ...datasetsConfig, ...{data: data,} },
    ],
  };

  const [sliderValue, setSliderValue] = useAtom(sliderValueAtom);
  const [drawer, setDrawer] = useAtom(drawerAtom);

  const changeValue = (event: Event, newValue: number | number[]) => {
    setSliderValue(newValue);
    
  }

	return (
    <>
      <Box className="graph-wrapper">
        <p className="big-text center">PPUndo</p>
        <Spacer size={6} />
        <Box className="slider-wrapper">
          <PrettoSlider
            className="slider"
            aria-label="PenPressure"
            defaultValue={0}
            value={sliderValue}
            // getAriaValueText={valuetext}
            valueLabelDisplay="auto"
            step={0.01}
            min={0}
            max={1}
            onChange={changeValue}
          />
        </Box>
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