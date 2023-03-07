import React, { useState } from "react";
import { useAtom } from 'jotai'
import { addLogOfBeforePPUndoAtom, avgPressureOfStrokeAtom, drawerAtom, getAvgPressureOfStrokeCountAtom, sliderValueAtom } from "@/infrastructures/jotai/drawer";
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
import { PPUndoGraphDatasetsConfigType, Point2Type, StrokeDataType } from "@/@types/note";
import { PrettoSlider, datasetsConfig, options, xLabels } from "@/configs/PPUndoGraphConifig";
import { getJaStringTime } from "@/modules/common/getJaStringTime";


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
  const [, setAddLogOfBeforePPUndo] = useAtom(addLogOfBeforePPUndoAtom);
  
  const [lowerPressureIndexList, setLowerPressureIndexList] = useState<number[]>([]);
  const [logData, setLogData] = useState<StrokeDataType | null>(null);

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
    // FIXME: 色変更の関数を別で実装しよう！もっとしっかりとした条件分岐で
    tmp.map(val => {
      const color = drawer.currentFigure.strokes[val].color;
      if(color.length == 7) {
        drawer.currentFigure.strokes[val].color = color + "22";
      }
    })
    lowerPressureIndexList.map(val => {
      const color = drawer.currentFigure.strokes[val].color;
      if (!tmp.includes(val) && color.length == 9 && color.slice(-2) != "00") {
        drawer.currentFigure.strokes[val].color = color.slice(0, -2);
      }
    })
    setLowerPressureIndexList(tmp);
    setDrawer(drawer);
    setTimeout(() => {
      drawer.reDraw();
    }, 100);
  }

  const actionStart = async () => {
    console.log("PPUndo操作開始");
    const numOfStroke = drawer.numOfStroke;
    if(numOfStroke <= 0) return
    const figure = drawer.currentFigure;
    figure.calculateRect();
    figure.normalize();
    figure.adapt();
    const res: string = await drawer.getBase64PngImage().catch((e: unknown) => {
      console.log(e);
    });
    const now = await getJaStringTime();
    const strokeData: StrokeDataType = {
      image: res? res : undefined,
      createTime: now,
      strokes: figure.strokes.map((stroke: any, i: number) => ({
        points: stroke.points.map((point: Point2Type, _j: number) => ({
          x: point.x,
          y: point.y,
          z: point.z,
        })),
        color: stroke!.color,
        strokeWidth: stroke!.strokeWidth,
        strokeAvgPressure: avgPressureOfStroke[i]
      })),
    };
    setLogData(strokeData);
  }

  const actionFinish = () => {
    console.log("PPUndo操作終了")
    console.log(drawer);
    lowerPressureIndexList.map(val => {
      const color = drawer.currentFigure.strokes[val].color;
      if (color.length == 9) {
        drawer.currentFigure.strokes[val].color = color.slice(0, -2) + "00";
      } else if (color.length == 7) {
        drawer.currentFigure.strokes[val].color = color + "00";
      }
    })
    setDrawer(drawer);
    setAddLogOfBeforePPUndo(logData!);
    
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