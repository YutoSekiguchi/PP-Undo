// import { useEffect, useState } from "react";
// import { TNoteDataWithoutLongData } from "@/@types/note";
// import { fetchAllNotesWithoutLongData } from "@/infrastructures/services/note";
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
// import { fabric } from "fabric";
// import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
// import { FabricDrawer } from "@/modules/fabricdrawer";
// import { Line } from "react-chartjs-2";
// import { confirmNumberArrayFromString } from "@/modules/common/confirmArrayFromString";
// import { datasetsConfig, options, xLabels } from "@/configs/analytics/LineGraphConfig";
// import { SPLIT_PRESSURE_COUNT } from "@/configs/PPUndoGraphConifig";
// import { rgbToHex } from "@/modules/note/RGBToHex";
// import { fetchStrokesByNID, updateStrokeGroupNum } from "@/infrastructures/services/strokes";
// import { NOTE_WIDTH_RATIO } from "@/configs/settings";
// import { noteAspectRatiotAtom } from "@/infrastructures/jotai/drawer";
// import { useAtom } from "jotai";
// import { Box, Button, TextField } from "@mui/material";
// import parse from 'html-react-parser';
// import { Params, useParams } from "react-router-dom";

// export const Annotation: () => JSX.Element = () => {
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

//   const { editor, onReady } = useFabricJSEditor();

//   const regex = /<g\b[^>]*>(.*?)<\/g>/gs;
//   const params: Params<string> = useParams();

//   const [fabricDrawer, setFabricDrawer] = useState<FabricDrawer>();

//   const [noteStrokes, setNoteStrokes] = useState<any[]>([]);
//   const [noteAspectRatio, setNoteAspectRatio] = useAtom(noteAspectRatiotAtom);
//   const [groupIndex, setGroupIndex] = useState<number>(0);
//   const [startGroupNum, setStartGroupNum] = useState<number | null>(null);
//   const [endGroupNum, setEndGroupNum] = useState<number | null>(null);
//   const [svgList, setSVGList] = useState<string[]>([]);

//   useEffect(() => {
//     if (!editor || !fabric || !(fabricDrawer === undefined && !!editor)) {
//       return;
//     }
    

//     const firstLoadData = async() => {

//       const instance = new FabricDrawer(editor);
//       setFabricDrawer(instance);
//       // console.log(noteData);
//       const nid = Number(params.nid);
//       console.log(nid)
//       const noteData = await fetchStrokesByNID(nid);
//       console.log(noteData)
//       setNoteStrokes(noteData)
//       if (instance?.getStrokeLength() == 0) {
//         if (noteData !== null) {
//           var canvas: any = canvas = new fabric.Canvas('test');
//           let svg = "";
//           var svgGroup: any = "";
//           var scaleRatio = 0.5; 
//           let tmp: string[] = []
//           for(var i=0; i<noteData.length; i++) {
            
//             fabric.loadSVGFromString(
//               noteData[i].StrokeData.strokes.svg,
            
//               (objects: fabric.Object[], _options: any) => {
//                 svgGroup = new fabric.Group(objects, {
//                   left: 0,
//                   top: 0
//                 });
              
//                 svgGroup.scale(scaleRatio);
//                 canvas.add(svgGroup);
//                 svg = canvas.toSVG();
//                 if (i < noteData.length -1) {
//                   canvas.clear()
//                 }
//               }
//             )
//             console.log("load")
            
//             // const gTags = svg.match(regex);
//             var clearSVG = svg.replace(/<\?xml.*?\?>\s*<!DOCTYPE[^>]*>/gi, '');

//             var container: HTMLElement = document.getElementById("container")!; // SVGを表示させるための要素を取得

//             // const diffTime = i > 0 ? noteData[i].StartTime - noteData[i - 1].EndTime: noteData[i].StartTime;

//             // var newEl = `
//             // <div>
//             //   <h3>No. ${i+1} / ID: ${noteData[i].ID}  筆圧: ${noteData[i].AvgPressure} / ストローク数：${gTags? gTags.length: 0}</h3>
//             //   <h3 ${diffTime >= 2000? 'style="color: red"': 'style="color: black"'}>diff: ${diffTime}ms / time: ${noteData[i].Time}ms</h3>
//             //   ${clearSVG}
//             // </div>`


//             // container.insertAdjacentHTML("beforeend", newEl);
//             tmp.push(clearSVG)
//           }
//           setSVGList(tmp)
//           // const svgLists = Array.from(document.querySelectorAll("svg"));

//           // svgLists.forEach((svg, i) => {
//           //   svg.addEventListener("click", () => handleSVGClick(noteData[i].ID));
//           // });

//           instance?.setSVGFromString(noteData[0].StrokeData.strokes.svg)
//           for(let i=0; i<editor.canvas._objects.length; i++) {
//             if (editor.canvas._objects[i].stroke!.slice(0, 3) === "rgb") {
//               editor.canvas._objects[i].stroke = rgbToHex(editor.canvas._objects[i].stroke!)
//             }
//             // Object.assign(editor.canvas._objects[i], { pressure: noteData.StrokeData.strokes.pressure[i] });
//             // Object.assign(editor.canvas._objects[i], { averagePressure: noteData.StrokeData.strokes.averagePressure[i] });
//           }
//         }
//       }
//     }

//     firstLoadData();
//     editor.canvas.renderAll();
//   }, [editor])

//   useEffect(() => {
//     if (!editor || !fabric) {
//       return;
//     }
//     fabricDrawer?.setDrawingMode();
//     fabricDrawer?.changeColor("#1f1f1f");
//     fabricDrawer?.setCanvasSize(50, 50);
//     // setBackgroundImage(NoteImg);
//     fabricDrawer?.reDraw();
//   }, [fabricDrawer]);

//   const handleGroupNumChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setGroupIndex(Number(event.target.value));
//     console.log(Number(event.target.value))
//   }

//   const handleSVGClick = async(i: any) => {
//     const clickID =  noteStrokes[i].ID
//     if(startGroupNum == null) {
//       setStartGroupNum(clickID);
//     } else {
//       if(startGroupNum == clickID) {
//         setStartGroupNum(null);
//       } else if(endGroupNum === clickID) {
//         setEndGroupNum(null);
//       } else {
//         setEndGroupNum(clickID);
//       }
//     }
//     console.log(i);

//   }

//   const submit = async() => {
//     if (startGroupNum != null && endGroupNum != null) {
//       await updateStrokeGroupNum(startGroupNum, endGroupNum, groupIndex);
//       setStartGroupNum(null);
//       setEndGroupNum(null);
//       alert("保存完了")
//     }
//   }

//   return (
//     <>
//       <Box
//         sx={{ width: "100%"}}
//       >
//         <Box
//           sx={{position: "fixed"}}
//         >
//           <TextField
//             helperText="グループ番号"
//             label="Number"
//             onChange={handleGroupNumChange}
//             value={groupIndex}
//           />
//           <Button
//             variant="contained"
//             onClick={submit}
//           >
//             登録
//           </Button>
//         </Box>
//       <Box
//         sx={{
//           width: 50,
//           height: 50,
//         }}
//       >
//         <FabricJSCanvas
//           // className="fabric-canvas"
//           onReady={onReady}
//           css={{
//             // backgroundImage: `url("${NoteImg}")`,
//             touchAction: "none",
//             // display:`${isPointer? "block": "none"}`,
//             backgroundSize: "contain"
//           }}
//         />
//       </Box>
//       <h2>最終状態</h2>
//       <canvas id="test" width="600" height="800"></canvas>
//       {/* {
//         noteStrokes.length > 0&&
//         <>
//         {noteStrokes[1].StrokeData.strokes.svg}
//         </>
//       } */}
//       <Box className="stroke-history">
//         <Box
//           id="container"
//           sx={{
//             width: window.innerWidth * NOTE_WIDTH_RATIO*5/10,
//             height: window.innerWidth * NOTE_WIDTH_RATIO * noteAspectRatio*5/10,
//           }}
//         >
//           {
//             svgList.map((svg, i) => {
//               return(
                
//                 <Box
//                   key={i}
//                   onClick={() => handleSVGClick(i)}
//                   sx={{ backgroundColor: `${(noteStrokes[i].ID === startGroupNum || noteStrokes[i].ID === endGroupNum)? "yellow": ""}`, padding: '20px'}}
//                 >
//                   <h3>No. {i+1} / ID: {noteStrokes[i].ID}  筆圧: {noteStrokes[i].AvgPressure} / ストローク数：{svg.match(regex)? svg.match(regex)!.length: 0} / グループ: {noteStrokes[i].GroupNum? noteStrokes[i].GroupNum: ""}</h3>
//                   {
//                     i > 0 && noteStrokes[i].StartTime - noteStrokes[i - 1].EndTime >= 2000?
//                     <h3 style={{color: "red"}}>diff: {i > 0 ? noteStrokes[i].StartTime - noteStrokes[i - 1].EndTime: noteStrokes[i].StartTime}ms / time: {noteStrokes[i].Time}ms</h3>
//                     :<h3 style={{color: "black"}}>diff: {i > 0 ? noteStrokes[i].StartTime - noteStrokes[i - 1].EndTime: noteStrokes[i].StartTime}ms / time: {noteStrokes[i].Time}ms</h3>
//                   }
//                   {parse(svg)}
//                 </Box>
//               );
//             })
//           }
//         </Box>
//       </Box>
//       </Box>
//     </>
//   );
// }