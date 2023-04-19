import React, { useState } from "react";
import { useAtom, useAtomValue } from 'jotai'
import {
  addLogOfBeforePPUndoAtom,
  avgPressureOfStrokeAtom,
  drawerAtom,
  getAvgPressureOfStrokeCountAtom,
  sliderValueAtom,
  logNotifierCountAtom,
  ppUndoCountAtom,
} from "@/infrastructures/jotai/drawer";
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
import { PPUndoGraphDatasetsConfigType, Point2Type, LogStrokeDataType, PostLogDataType } from "@/@types/note";
import { PrettoSlider, datasetsConfig, options, xLabels } from "@/configs/PPUndoGraphConifig";
import { getJaStringTime } from "@/modules/common/getJaStringTime";
import { getStrokesIndexWithLowPressure, hideLowPressureStrokes, increaseStrokeColorOpacity, reduceStrokeColorOpacity } from "@/modules/note/PPUndo";
import { getCurrentStrokeData } from "@/modules/note/GetCurrentStrokeData";
import { myNoteAtom } from "@/infrastructures/jotai/notes";
import { addLog } from "@/infrastructures/services/logs";


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
  const avgPressureOfStroke = useAtomValue(avgPressureOfStrokeAtom);
  const [, setAddLogOfBeforePPUndo] = useAtom(addLogOfBeforePPUndoAtom);
  const [logNotifierCount, setLogNotifierCount] = useAtom(logNotifierCountAtom);
  const [ppUndoCount, setPPUndoCount] = useAtom(ppUndoCountAtom)
  const [myNote, ] = useAtom(myNoteAtom);
  
  const [lowerPressureIndexList, setLowerPressureIndexList] = useState<number[]>([]);
  const [logData, setLogData] = useState<LogStrokeDataType | null>(null);
  const [prevSliderValue, setPrevSliderValue] = useState<number | number[]>(0);
  const [logStrokeData, setLogStrokeData] = useState<any>({})

  const changeValue = (event: Event, newValue: number | number[]) => {
    const newLowerPressureIndexList: number[] = getStrokesIndexWithLowPressure(avgPressureOfStroke, newValue);
    setSliderValue(newValue);
    if (newLowerPressureIndexList.length == lowerPressureIndexList.length) {
      return;
    }
    // FIXME: 色変更の関数を別で実装しよう！もっとしっかりとした条件分岐で
    // 色を薄く
    reduceStrokeColorOpacity(
      newLowerPressureIndexList,
      drawer.currentFigure.strokes
    );
    // 色を元に戻す
    increaseStrokeColorOpacity(
      lowerPressureIndexList,
      newLowerPressureIndexList,
      drawer.currentFigure.strokes
    );
    setLowerPressureIndexList(newLowerPressureIndexList);
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
    const res: string = await drawer.getBase64PngImage().catch((error: unknown) => {
      console.log(error);
    });
    const now = await getJaStringTime();
    const strokeData: LogStrokeDataType = {
      image: res? res : undefined,
      sliderValue: sliderValue,
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
    setPrevSliderValue(sliderValue);
    const _logStrokeData = await getCurrentStrokeData(figure.strokes);
    setLogStrokeData(_logStrokeData);
    setLogData(strokeData);
  }

  const actionFinish = async () => {
    console.log("PPUndo操作終了")
    hideLowPressureStrokes(
      lowerPressureIndexList,
      drawer.currentFigure.strokes
    )
    setDrawer(drawer);
    setAddLogOfBeforePPUndo(logData!);
    setLogNotifierCount(logNotifierCount + 1);
    setPPUndoCount(ppUndoCount + 1);
    const postLogData: PostLogDataType = {
      UID: myNote?.UID? myNote?.UID: 0,
      NID: myNote?.ID? myNote?.ID: 0,
      StrokeData: logStrokeData,
      LogImage: logData!.image? logData!.image: "",
      AvgPressureList: avgPressureOfStroke.join(','),
      Save: 0,
      SliderValue: sliderValue,
      BeforeLogRedoSliderValue: prevSliderValue,
    }
    await addLog(postLogData);
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