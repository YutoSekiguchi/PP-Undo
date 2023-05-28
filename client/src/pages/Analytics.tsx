import { useEffect, useState } from "react";
import { TNoteDataWithoutLongData } from "@/@types/note";
import { fetchAllNotesWithoutLongData } from "@/infrastructures/services/note";
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
import { confirmNumberArrayFromString } from "@/modules/common/confirmArrayFromString";
import { datasetsConfig, options, xLabels } from "@/configs/analytics/LineGraphConfig";
import { SPLIT_PRESSURE_COUNT } from "@/configs/PPUndoGraphConifig";

export const Analytics: () => JSX.Element = () => {
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

  const [allNoteData, setAllNoteData] = useState<TNoteDataWithoutLongData[]>([]);
  const [allPressureDistributionData, setAllPressureDistributionData] = useState<number[]>([]);
  const [notePressureDistributionData, setNotePressureDistributionData] = useState<(number)[][]>([]);


  const allPressureDistributionGraphData = {
    labels: xLabels,
    datasets: [
      {
        ...datasetsConfig(0),
        ...{data: allPressureDistributionData}
      }
    ]
  }
  const notePressureDistributionGraphData = {
    labels: xLabels,
    datasets: notePressureDistributionData.map((data, i) => {
      return {
        ...datasetsConfig(i),
        ...{data: data}
      }
    })
  };

  const firstLoadData = async() => {
    const resAllNoteData = await fetchAllNotesWithoutLongData();
    setAllNoteData(resAllNoteData);
    let allPressureDistributionDataTmp: number[] = [...Array(SPLIT_PRESSURE_COUNT + 1)].fill(0);
    let allPressureEachNoteDataTmp: number[][] = [];
    let notePressureDistributionDataTmp: (number)[][] = [];

    resAllNoteData.map((data: TNoteDataWithoutLongData, i: number) => {
      allPressureEachNoteDataTmp.push(confirmNumberArrayFromString(data.AllAvgPressureList));
    });
    allPressureEachNoteDataTmp.map((li: number[], _) => {
      let tmp: number[] = [...Array(SPLIT_PRESSURE_COUNT + 1)].fill(0);
      li.map((pressure: number, _) => {
        const j = Math.round(pressure*100)/100;
        tmp[Math.ceil(j*SPLIT_PRESSURE_COUNT)] += 1;
        allPressureDistributionDataTmp[Math.ceil(j*SPLIT_PRESSURE_COUNT)] += 1;
      })
      notePressureDistributionDataTmp.push(tmp);
    })
    setNotePressureDistributionData(notePressureDistributionDataTmp);
    setAllPressureDistributionData(allPressureDistributionDataTmp);
  }

  useEffect(() => {
    firstLoadData();
  }, [])

  return (
    <>
      <Line
        data={allPressureDistributionGraphData}
        options={options}
        title="全てのノートの筆圧分布"
      />
      <Line
        data={notePressureDistributionGraphData}
        options={options}
        title="ノートごとの筆圧分布"
      />
    </>
  );
}