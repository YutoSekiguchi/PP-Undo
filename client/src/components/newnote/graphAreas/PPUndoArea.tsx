import React, { useEffect, useState } from "react";
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
  Box, Typography,
} from "@mui/material";
import Spacer from "@/components/common/Spacer";
import { PPUndoGraphDatasetsConfigType, Point2Type, LogStrokeDataType, PostLogDataType, PostPPUndoCountsDataType } from "@/@types/note";
import { PrettoSlider, datasetsConfig, options, xLabels } from "@/configs/PPUndoGraphConifig";
import { getJaStringTime } from "@/modules/common/getJaStringTime";
import { getStrokesIndexWithLowPressure, hideLowPressureStrokes, increaseStrokeColorOpacity, reduceStrokeColorOpacity, getDiffLowerPressureIndexList } from "@/modules/note/PPUndo";
import { getCurrentStrokeData } from "@/modules/note/GetCurrentStrokeData";
import { myNoteAtom } from "@/infrastructures/jotai/notes";
import { addClientLog, addLog } from "@/infrastructures/services/ppUndoLogs";
import { calcIsShowStrokeCount } from "@/modules/note/CalcIsShowStroke";
import { addPPUndoCount } from "@/infrastructures/services/ppUndoCounts";
import { drawMode } from "@nkmr-lab/average-figure-drawer";
import { FabricDrawer } from "@/modules/fabricdrawer";


export const PPUndoArea: React.FC<{fabricDrawer: FabricDrawer | null}> = ({ fabricDrawer }) => {
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

  const [data, setData] = useState<number[]>([]);
  const graphData: graphDataType = {
    labels: xLabels,
    datasets: [
      { ...datasetsConfig, ...{data: data,} },
    ],
  };

  const [sliderValue, setSliderValue] = useAtom(sliderValueAtom);
  const [drawer, setDrawer] = useAtom(drawerAtom);
  // const avgPressureOfStroke = useAtomValue(avgPressureOfStrokeAtom);
  const [, setAddLogOfBeforePPUndo] = useAtom(addLogOfBeforePPUndoAtom);
  const [logNotifierCount, setLogNotifierCount] = useAtom(logNotifierCountAtom);
  const [ppUndoCount, setPPUndoCount] = useAtom(ppUndoCountAtom)
  const [myNote, ] = useAtom(myNoteAtom);
  
  const [lowerPressureIndexList, setLowerPressureIndexList] = useState<number[]>([]);
  const [logData, setLogData] = useState<LogStrokeDataType | null>(null);
  const [prevSliderValue, setPrevSliderValue] = useState<number | number[]>(0);
  const [logStrokeData, setLogStrokeData] = useState<any>({})
  const [defaultSliderValue, setDefaultSliderValue] = useState<number | number[] | undefined>(sliderValue);
  const [strokeIndexList, setStrokeIndexList] = useState<number[]>([]);

  useEffect(() => {
    let tmp: number[] = [...Array(21)].fill(0);
    fabricDrawer?.getPressureList().map((pressure, _) => {
      const j = Math.round(pressure*100)/100;
      tmp[Math.ceil(j*20)] += 1
    })
    setData(tmp);
  }, [fabricDrawer?.getStrokeLength()])

  const changeValue = async(event: Event, newValue: number | number[]) => {
    const pressureList: number[] = fabricDrawer? fabricDrawer.getPressureList(): [];
    const newLowerPressureIndexList: number[] = getStrokesIndexWithLowPressure(
      pressureList,
      newValue,
    );
    setSliderValue(newValue)
    if (newLowerPressureIndexList.length == lowerPressureIndexList.length) {
      return;
    }
    // 色を薄く
    fabricDrawer?.changeStrokesColorToLight(newLowerPressureIndexList);
    // 色を元に戻す
    fabricDrawer?.changeStrokesColorToDark(
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
    // const numOfStroke = drawer.numOfStroke;
    // if(numOfStroke <= 0) return
    // const figure = drawer.currentFigure;
    // figure.calculateRect();
    // figure.normalize();
    // figure.adapt();
    // const res: string = await drawer.getBase64PngImage().catch((error: unknown) => {
    //   console.log(error);
    // });
    // const now = getJaStringTime();
    // const strokeData: LogStrokeDataType = {
    //   image: res? res : undefined,
    //   sliderValue: sliderValue,
    //   createTime: now,
    //   strokes: figure.strokes.map((stroke: any, i: number) => ({
    //     points: stroke.points.map((point: Point2Type, _j: number) => ({
    //       x: point.x,
    //       y: point.y,
    //       z: point.z,
    //     })),
    //     color: stroke!.color,
    //     strokeWidth: stroke!.strokeWidth,
    //     strokeAvgPressure: avgPressureOfStroke[i]
    //   })),
    // };
    // setPrevSliderValue(sliderValue);
    // await addClientLog(
    //   {
    //     NID: myNote?.ID? myNote?.ID: 0,
    //     Data: strokeData,
    //   }
    // );
    // const _logStrokeData = await getCurrentStrokeData(figure.strokes);
    // setLogStrokeData(_logStrokeData);
    // setLogData(strokeData);
  }

  const actionFinish = async (event: any) => {
    // const newSliderValue = Number(event.target.value);
    // setSliderValue(newSliderValue)
    // hideLowPressureStrokes(
    //   lowerPressureIndexList,
    //   drawer.currentFigure.strokes
    // )
    // setDrawer(drawer);
    // setAddLogOfBeforePPUndo(logData!);
    // setLogNotifierCount(logNotifierCount + 1);
    // setPPUndoCount(ppUndoCount + 1);
    // const postLogData: PostLogDataType = {
    //   UID: myNote?.UID? myNote?.UID: 0,
    //   NID: myNote?.ID? myNote?.ID: 0,
    //   StrokeData: logStrokeData,
    //   LogImage: logData!.image? logData!.image: "",
    //   AvgPressureList: avgPressureOfStroke.join(','),
    //   Save: 0,
    //   // SliderValue: newSliderValue,
    //   SliderValue: sliderValue,
    //   BeforeLogRedoSliderValue: prevSliderValue,
    // }
    // await addLog(postLogData);
    // setTimeout(async() => {
    //   await drawer.reDraw();
    //   const reqStrokeData = await getCurrentStrokeData(drawer.currentFigure.strokes);
    //   const img: string = await drawer.getBase64PngImage().catch((error: unknown) => {
    //     console.log(error);
    //   });
    //   const beforePPUndoStrokeCount: number = calcIsShowStrokeCount(logStrokeData.Strokes);
    //   const afterPPUndoStrokeCount: number = calcIsShowStrokeCount(drawer.currentFigure.strokes);
    //   const postPPUndoCountsData: PostPPUndoCountsDataType = {
    //     UID: myNote?.UID? myNote?.UID: 0,
    //     NID: myNote?.ID? myNote?.ID: 0,
    //     AfterPPUndoStrokeData: reqStrokeData,
    //     AfterPPUndoImageData: img,
    //     BeforePPUndoStrokeCount: beforePPUndoStrokeCount,
    //     AfterPPUndoStrokeCount: afterPPUndoStrokeCount,
    //   }
    //   await addPPUndoCount(postPPUndoCountsData);
    // }, 100);
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
          {/* {
            (defaultSliderValue!=undefined)?
              <input 
                key={defaultSliderValue}
                id="large-range" 
                className="slider"
                type="range"
                // value={sliderValue}
                defaultValue={defaultSliderValue}
                min="0"
                step="0.001"
                max="1" 
                // onChange={changeValue} 
                onPointerDownCapture={actionStart}
                onInput={changeValue}
                onPointerUpCapture={actionFinish}
              />
              :<></>
          } */}
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