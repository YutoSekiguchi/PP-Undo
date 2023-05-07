import React, { useEffect, useState } from "react";
import { useAtom } from 'jotai'
import {
  addLogOfBeforePPUndoAtom,
  sliderValueAtom,
  logNotifierCountAtom,
  ppUndoCountAtom,
  backgroundImageAtom,
  historyAtom,
  historyForRedoAtom,
  avgPressureOfStrokeAtom,
  isDemoAtom,
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
  Box, Typography,
} from "@mui/material";
import Spacer from "@/components/common/Spacer";
import { TPPUndoGraphDatasetsConfig, TPostLogData, TPostPPUndoCountsData} from "@/@types/note";
import { PrettoSlider, datasetsConfig, options, xLabels } from "@/configs/PPUndoGraphConifig";
import { getJaStringTime } from "@/modules/common/getJaStringTime";
import { getStrokesIndexWithLowPressure } from "@/modules/note/PPUndo";
import { myNoteAtom } from "@/infrastructures/jotai/notes";
import { addClientLog, addLog } from "@/infrastructures/services/ppUndoLogs";
import { addPPUndoCount } from "@/infrastructures/services/ppUndoCounts";
import { FabricDrawer } from "@/modules/fabricdrawer";
import { TLogStrokeData } from "@/@types/note";


export const PPUndoArea: React.FC<{fabricDrawer: FabricDrawer}> = ({ fabricDrawer }) => {
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
  interface TDatasets extends TPPUndoGraphDatasetsConfig, TData {};
  interface TGraphData {
    labels: number[];
    datasets: TDatasets[];
  }

  const [data, setData] = useState<number[]>([]);
  const graphData: TGraphData = {
    labels: xLabels,
    datasets: [
      { ...datasetsConfig, ...{data: data,} },
    ],
  };

  const [sliderValue, setSliderValue] = useAtom(sliderValueAtom);
  const [, setAddLogOfBeforePPUndo] = useAtom(addLogOfBeforePPUndoAtom);
  const [logNotifierCount, setLogNotifierCount] = useAtom(logNotifierCountAtom);
  const [ppUndoCount, setPPUndoCount] = useAtom(ppUndoCountAtom)
  const [myNote, ] = useAtom(myNoteAtom);
  
  const [lowerPressureIndexList, setLowerPressureIndexList] = useState<number[]>([]);
  const [logData, setLogData] = useState<TLogStrokeData | null>(null);
  const [, setPrevSliderValue] = useState<number | number[]>(0);
  const [defaultSliderValue, setDefaultSliderValue] = useState<number | number[] | undefined>(sliderValue);
  const [backgroundImage, ] = useAtom(backgroundImageAtom);
  const [, setHistory] = useAtom(historyAtom);
  const [, setHistoryForRedo] = useAtom(historyForRedoAtom);
  const [avgPressureOfStroke, ] = useAtom(avgPressureOfStrokeAtom);
  const [isDemo, ] = useAtom(isDemoAtom);


  const setGraphData = () => {
    let tmp: number[] = [...Array(21)].fill(0);
    fabricDrawer?.getPressureList().map((pressure, _) => {
      const j = Math.round(pressure*100)/100;
      tmp[Math.ceil(j*20)] += 1
    })
    setData(tmp);
  }

  useEffect(() => {
    setGraphData();
  }, [fabricDrawer.getStrokeLength()])

  const changeValue = async(event: Event, newValue: number | number[]) => {
    setSliderValue(newValue)
    if (fabricDrawer.getStrokeLength() == 0) { return; }
    const pressureList: number[] = fabricDrawer? fabricDrawer.getPressureList(): [];
    const newLowerPressureIndexList: number[] = getStrokesIndexWithLowPressure(
      pressureList,
      newValue,
    );
    if (newLowerPressureIndexList.length == lowerPressureIndexList.length) {
      return;
    }
    // 色を薄く
    fabricDrawer.changeStrokesColorToLight(newLowerPressureIndexList);
    // 色を元に戻す
    fabricDrawer.changeStrokesColorToDark(
      lowerPressureIndexList,
      newLowerPressureIndexList,
    );
    setLowerPressureIndexList(newLowerPressureIndexList);
  }


  // useEffect(() => {
  //   if(defaultSliderValue != undefined) {return;}
  //   const getSliderValue = sliderValue? sliderValue: 0;
  //   setDefaultSliderValue(getSliderValue);
  //   console.log("defaultSliderValueの更新", sliderValue)
  // }, [sliderValue])

  const actionStart = async () => {
    const img = fabricDrawer.getImg();
    const now = getJaStringTime();
    const strokes = fabricDrawer.getAllStrokes();
    const svg = fabricDrawer.getSVG();
    const strokeData: TLogStrokeData = {
      image: img,
      backgroundImage: backgroundImage,
      sliderValue: sliderValue,
      createTime: now,
      strokes: [],
      svg: svg,
      pressureList: fabricDrawer.getPressureList(),
    };
    setPrevSliderValue(sliderValue);
    setLogData(strokeData);

    if(isDemo) { return; }
    await addClientLog(
      {
        NID: myNote?.ID? myNote?.ID: 0,
        Data: strokeData,
      }
    );
  }

  const actionFinish = async () => {
    fabricDrawer.clearStrokesColor();
    setAddLogOfBeforePPUndo(logData!);
    setGraphData();
    setLogNotifierCount(logNotifierCount + 1);
    const postLogData: TPostLogData = {
      UID: myNote?.UID? myNote?.UID: 0,
      NID: myNote?.ID? myNote?.ID: 0,
      // StrokeData: {"Strokes": {"data": logData!.strokes, "pressure": fabricDrawer!.getPressureList(), "svg": fabricDrawer?.getSVG()}},
      StrokeData: {"Strokes": {"data": [], "pressure": [], "svg": ""}},
      // LogImage: logData!.image? logData!.image: "",
      LogImage: "",
      AvgPressureList: avgPressureOfStroke.join(','),
      Save: 0,
      SliderValue: sliderValue,
      BeforeLogRedoSliderValue: 0,
    }
    setHistory([]);
    setHistoryForRedo([]);
    setSliderValue(0);
    setPPUndoCount(ppUndoCount + 1);

    if(isDemo) { return; }
    await addLog(postLogData);
    setTimeout(async() => {
      const img = fabricDrawer.getImg();
      const postPPUndoCountsData: TPostPPUndoCountsData = {
        UID: myNote?.UID? myNote?.UID: 0,
        NID: myNote?.ID? myNote?.ID: 0,
        AfterPPUndoStrokeData: {"Strokes": {"data": fabricDrawer.getAllStrokes(), "pressure": fabricDrawer.getPressureList(), "svg": fabricDrawer.getSVG()}},
        AfterPPUndoImageData: "",
        BeforePPUndoStrokeCount: logData!.strokes.length,
        AfterPPUndoStrokeCount: fabricDrawer.getStrokeLength(),
      }
      await addPPUndoCount(postPPUndoCountsData);
    }, 100);
  }


	return (
    <>
      <Box className="graph-wrapper">
        <Typography component="div">
          <Box className="big-white-text center ppundo-title">PPUndo</Box>
        </Typography>
        <Spacer size={6} />
        <Box className="slider-wrapper">
          <PrettoSlider
            className="slider"
            aria-label="PenPressure"
            defaultValue={defaultSliderValue}
            value={sliderValue}
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