import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Logo from '@/assets/logo.png'
import { 
  Box,
  Toolbar,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import { penColorList } from "@/configs/PenColorConfig";
import Spacer from "@/components/common/Spacer";
import { TPenColor, TPostEraseSelectedObjectsCountData } from "@/@types/note";
import { FabricDrawer } from "@/modules/fabricdrawer";
import { ColorButton } from "./ColorButton";
import { penWidthList } from "@/configs/PenWidthConfig";
import { ChangePenWidthButton } from "./ChangePenWidthButton";
import { PenButton } from "./PenButton";
import { PointerButton } from "./PointerButton";
import { StrokeEraseButton } from "./StrokeEraseButton";
import { UndoButton } from "./UndoButton";
import { RedoButton } from "./RedoButton";
import { useAtom } from "jotai";
import { addHistoryAtom, drawModeAtom, isDemoAtom } from "@/infrastructures/jotai/drawer";
import { isAuth } from "@/modules/common/isAuth";
import styled from "@emotion/styled";
import { myNoteAtom } from "@/infrastructures/jotai/notes";
import { addEraseSelectedObjectsCount } from "@/infrastructures/services/erase/selectedObjectsCounts";
import { PRESSURE_ROUND_VALUE } from "@/configs/settings";

export const NewNoteHeader:React.FC<{fabricDrawer: FabricDrawer, save: () => Promise<void>}> = ({ fabricDrawer, save }) => {
  const navigate = useNavigate();
  const colorList: TPenColor[] = penColorList;
  const [color, setColor] = useState<string>(penColorList[0].penColor);
  const [strokeWidth, setStrokeWidth] = useState<number>(penWidthList[0]);
  const [myNote, ] = useAtom(myNoteAtom);
  const [isDemo, ] = useAtom(isDemoAtom);
  const [drawMode, ] = useAtom(drawModeAtom);
  const [, addHistory] = useAtom(addHistoryAtom);

  const EraseSelectedObjectsButton = styled(Button) ({
    backgroundColor:'#1A2939',
    color: '#fff',
    '&:hover': {
      backgroundColor: "#777",
      color: '#fff',
    },
  })
  
  const backToHome = () => {
    if (isAuth()) {
      navigate('/notefolders/0');
    } else {
      navigate('/')
    }
  }

  // 今の色表示&カラーピッカー
  const ColorPicker: React.FC = () => {

    return (
      <Box className="now-color">
        <input
          className="color-picker"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <Typography fontSize={6} align="center">Now</Typography>
      </Box>
    );
  }

  const eraseSelectedObjects = async () => {
    if (fabricDrawer.getSelectedObjects()!.length > 0) {
      const beforeEraseSelectedObjectsData = {"Strokes": {"data": fabricDrawer.editor.canvas.getObjects(), "pressure": fabricDrawer.getAveragePressureList(), "svg": fabricDrawer.getSVG()}};
      const beforeEraseSelectedObjectsStrokeCount = fabricDrawer?.getStrokeLength();

      addHistory({
        type: "erase",
        strokes: fabricDrawer.getSelectedObjects()!,
      })
      fabricDrawer.removeSelectedStrokes();

      const afterEraseSelectedObjectsData = {"Strokes": {"data": fabricDrawer.editor.canvas.getObjects(), "pressure": fabricDrawer.getAveragePressureList(), "svg": fabricDrawer.getSVG()}};
      const afterEraseSelectedObjectsStrokeCount = fabricDrawer?.getStrokeLength();
      console.log("fefe")
      
      const postEraseSelectedObjectsCountData: TPostEraseSelectedObjectsCountData = {
        UID: myNote?.UID? myNote?.UID: 0,
        NID: myNote?.ID? myNote?.ID: 0,
        BeforeEraseSelectedObjectsNoteImage: "",
        BeforeEraseSelectedObjectsStrokeData: beforeEraseSelectedObjectsData,
        AfterEraseSelectedObjectsNoteImage: "",
        AfterEraseSelectedObjectsStrokeData: afterEraseSelectedObjectsData,
        BeforeEraseSelectedObjectsStrokeCount: beforeEraseSelectedObjectsStrokeCount,
        AfterEraseSelectedObjectsStrokeCount: afterEraseSelectedObjectsStrokeCount,
        Now: Math.round(performance.now() * PRESSURE_ROUND_VALUE) / PRESSURE_ROUND_VALUE
      };
      await addEraseSelectedObjectsCount(postEraseSelectedObjectsCountData)
    }
  }

  const handleSave = async () => {
    await save();
    alert("保存しました");
  }
  

  useEffect(() => {
    fabricDrawer.changeColor(color);
  }, [color]);

  useEffect(() => {
    fabricDrawer.setStrokeWidth(strokeWidth)
  }, [strokeWidth])

  return (
    <>
      <Box className="note-header">
        <Paper sx={{ background: "#F2F6FC", borderBottom: '1px solid #F2F6FC' }} elevation={0}  >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box 
              className="center pointer"
              onClick={backToHome}
            >
              <img 
                src={Logo}
                style={{ width: "40px", height: "40px", marginRight: "10px" }}
                alt="PP-Undo logo"
              />
              <Typography
                variant="h5"
                noWrap
                component="div"
                sx={{ fontWeight: "bold" }}
              >
                PP-Undo改{isDemo&& "デモ"}
              </Typography>
            </Box>

            <Box className="align-center">
              <Box className="align-center" sx={{ marginRight: "60px"}}>
                <PointerButton fabricDrawer={fabricDrawer} />
                <Spacer size={6} axis="horizontal" />
                <StrokeEraseButton fabricDrawer={fabricDrawer} />
                <Spacer size={6} axis="horizontal" />
                <PenButton fabricDrawer={fabricDrawer} />
              </Box>
              {
                drawMode=="pointer"
                ? <>
                    <EraseSelectedObjectsButton
                      onClick={eraseSelectedObjects}
                    >
                      DELETE SELECTING STROKES
                    </EraseSelectedObjectsButton>
                  </>
                : <>
                  {colorList.map((el, index) => (
                    <Box 
                      key={index}
                    >
                      <ColorButton
                        buttonColor={el.penColor}
                        isChoice={el.useable}
                        setColor={setColor}
                        fabricDrawer={fabricDrawer}
                      />
                    </Box>
                  ))}
                  <Spacer size={6} axis="horizontal" />
                  <ColorPicker />
                  <Box className="align-center" sx={{ marginLeft: "20px"}}>
                    <ChangePenWidthButton
                      strokeWidth={strokeWidth}
                      setStrokeWidth={setStrokeWidth}
                    />
                  </Box>
                </>
              }
              
            </Box>
            
            <Box className="align-center">
              <UndoButton fabricDrawer={fabricDrawer} />
              <Spacer size={4} axis="horizontal" />
              <RedoButton fabricDrawer={fabricDrawer} />
              {
                (!isDemo) &&
                <>
                  <Spacer size={12} axis="horizontal" />
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                </>
              }
            </Box>
          </Toolbar>
        </Paper>
      </Box>
    </>
  );
}