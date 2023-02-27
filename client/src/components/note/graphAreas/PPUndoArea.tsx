import React, { useState } from "react";
import { useAtom } from 'jotai'
import { avgPressureOfStrokeAtom, drawerAtom, getAvgPressureOfStrokeCountAtom, sliderValueAtom } from "@/infrastructures/jotai/drawer";
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
  const [avgPressureOfStroke, ] = useAtom(avgPressureOfStrokeAtom);
  const [lowerPressureIndexList, setLowerPressureIndexList] = useState<number[]>([]);

  const changeValue = (event: Event, newValue: number | number[]) => {
    let tmp: number[] = [];
    avgPressureOfStroke.map((pressure, i) => {
      if(typeof newValue == "number" && Math.round(pressure*100)/100 <= newValue) {
        tmp.push(i);
      }
    })
    setSliderValue(newValue);
    if (tmp.length == lowerPressureIndexList.length) {
      return;
    }
    
    tmp.map(val => {
      if(drawer.currentFigure.strokes[val].color.length == 7) {
        drawer.currentFigure.strokes[val].color += "22";
      }
    })
    lowerPressureIndexList.map(val => {
      if (!tmp.includes(val) && drawer.currentFigure.strokes[val].color.length == 9 && drawer.currentFigure.strokes[val].color.slice(-2) != "00") {
        drawer.currentFigure.strokes[val].color = drawer.currentFigure.strokes[val].color.slice(0, -2);
      }
    })
    setLowerPressureIndexList(tmp);
    setDrawer(drawer);
    setTimeout(() => {
      drawer.reDraw();
    }, 100);
  }

  const actionStart = () => {
    console.log("PPUndo操作開始");
  }

  const actionFinish = () => {
    console.log("PPUndo操作終了")
    lowerPressureIndexList.map(val => {
      if (drawer.currentFigure.strokes[val].color.length == 9) {
        drawer.currentFigure.strokes[val].color = drawer.currentFigure.strokes[val].color.slice(0, -2) + "00";
      } else if (drawer.currentFigure.strokes[val].color.length == 7) {
        drawer.currentFigure.strokes[val].color += "00";
      }
    })
    setDrawer(drawer);
    setTimeout(() => {
      drawer.reDraw();
    }, 100);
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
            // valueLabelDisplay="auto"
            step={0.0001}
            min={0}
            max={1}
            onChange={changeValue}
            onChangeCommitted={actionFinish}
            onPointerDownCapture={actionStart}
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