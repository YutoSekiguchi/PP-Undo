import React, { useEffect, useState } from "react";
import { useAtom } from 'jotai'
import { avgPressureOfStrokeAtom, basisPressureAtom, getPressureModeAtom, historyGroupPressureAtom, isShowAllGroupBoxAtom, nowPointPressureAtom, pointerXAtom, pointerYAtom, waveCountAtom } from "@/infrastructures/jotai/drawer";
import {
  Box, Button, MobileStepper, Typography 
} from "@mui/material";
import { PPUndoArea } from "./PPUndoArea";
import { LogRedo } from "./LogRedo";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import { DoughnutPressureGraph } from "./DoughnutPressureGraph";
import { avgDatasetsConfig, avgGraphLabel, nowDatasetsConfig, nowGraphLabel } from "@/configs/DoughnutPressureGraphConfig";
import { getAveragePressure } from "@/modules/note/GetAveragePressure";
import { NowPressure } from "@/modules/note/NowPressure";
import { FabricDrawer } from "@/modules/fabricdrawer";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { BORDER_WAVE_COUNT } from "@/configs/settings";
import { getGradientColor } from "@/modules/note/GetGradientColor";
import ModeChangeIcon from "@/components/icons/ModeChangeIcon";
import Spacer from "@/components/common/Spacer";
import GradientButton from "@/components/common/GradientButton";

export const NoteGraphAreas: React.FC<{fabricDrawer: FabricDrawer}> = ({ fabricDrawer }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(1);
  const maxSteps = 2;
  const [avgPressureOfStroke, ] = useAtom(avgPressureOfStrokeAtom);
  const [basisPressure, ] = useAtom(basisPressureAtom);
  const [historyGroupPressure, ] = useAtom(historyGroupPressureAtom);
  const [getPressureMode, setGetPressureMode] = useAtom(getPressureModeAtom);
  const [nowPointPressure, ] = useAtom(nowPointPressureAtom);
  const [waveCount, ] = useAtom(waveCountAtom);
  const [pointerX, ] = useAtom(pointerXAtom);
  const [pointerY, ] = useAtom(pointerYAtom);
  const [isShowAllGroupBox, setIsShowAllGroupBox] = useAtom(isShowAllGroupBoxAtom);

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    borderRadius: 5,
    height: 30,
    width: 180,
    marginLeft: 16,
    backgroundImage: "linear-gradient(270deg, rgba(61, 200, 194, 1), rgba(206, 216, 0, 1) 35%, rgba(243, 184, 51, 1) 55%, rgba(255, 174, 68, 1) 74%, rgba(234, 114, 0, 1))",
    transform: "rotate(180deg)",
    [`& .${linearProgressClasses.bar}`]: {
      // borderRadius: 5,
      // backgroundColor: '#eee',
      backgroundColor: "#063852",
      // backgroundImage: `linear-gradient(90deg, rgba(74,211,255,1) 30% ${basisPressure > 0.3 ? `,rgba(158,220,190,1) 60%` : ""} ${basisPressure > 0.5 ? `,rgba(255,171,0,1) 90%` : ""} ${basisPressure > 0.7 ? `,rgba(255,0,0,1) 100%` : ""})`,
    },
    [`& .${linearProgressClasses.bar2Indeterminate}`]:{
      backgroundColor: "red"
    } 
  }));

  const MoveNowBorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    pointerEvents: 'none',
    borderRadius: 5,
    height: 20,
    width: 100,
    marginLeft: 16,
    backgroundColor: '#eeeeeecc',
    border: (waveCount > BORDER_WAVE_COUNT -1)? "#e00000aa 5px solid": "",
    padding: 5,
    position: "fixed",
    top: pointerY + 30,
    left: pointerX - 110,
    zIndex: 9999,
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: `${getGradientColor(nowPointPressure, false)}66`,
    },
  }));
  
  const NowBorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    borderRadius: 5,
    height: 30,
    width: 180,
    marginLeft: 16,
    backgroundColor: "#063852",
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: waveCount <= BORDER_WAVE_COUNT -1? '#eee': "#ff7f50",
    },
  }));

  const SmallBorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    borderRadius: 5,
    height: 30,
    width: 100,
    marginLeft: 16,
    backgroundColor: "#063852",
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: '#eee',
    },
  }));

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleClickShowAllGroupBox = () => {
    setIsShowAllGroupBox(!isShowAllGroupBox);
  }

  const changePressureMode = () => {
    if (activeStep == 0) {
      handleNext();
    } else {
      handleBack();
    }
  }

  useEffect(() => {
    if (activeStep === 1) {
      setGetPressureMode("avg");
    } else if (activeStep === 0) {
      setGetPressureMode("transform");
    }
  }, [activeStep])

  const GraphStepper = styled(MobileStepper)({
    backgroundColor: '#1A293900',
    margin: "15px 0 0 0",
    position: "absolute",
    bottom: "0",
    width: "100%",
    "& .MuiMobileStepper-dot": {
      backgroundColor: "#eeeeee55",
    },
    "& .MuiMobileStepper-dotActive": {
      backgroundColor: "#eee"
    }
  });

	return (
    <Box className="graph-area">
      <PPUndoArea fabricDrawer={fabricDrawer} />
      <Box sx={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
        <LogRedo fabricDrawer={fabricDrawer} />
        <Box className="white-text center pointer mode-text" onClick={changePressureMode}>
          <ModeChangeIcon />
          <Spacer size={6} />
          <Typography fontSize={12} fontWeight="bold">
            {getPressureMode=="avg"? "アベレージモード": "グルーピングモード"}
          </Typography>
        </Box>
      </Box>
      <Box className="graph-wrapper graph-wrapper-height">
        {
          activeStep == 1 && 
          <Box sx={{width: "100%", height: "100%"}}>
            <Box sx={{display: "flex", justifyContent: "space-around", alignItems: "center"}}>
              <DoughnutPressureGraph
                pressureValue={NowPressure(avgPressureOfStroke)}
                title="Now"
                graphLabel={nowGraphLabel}
                datasetsConfig={nowDatasetsConfig}
              />
            </Box>
            <Box sx={{display: "flex", justifyContent: "space-around", alignItems: "center"}}>
              <DoughnutPressureGraph
                pressureValue={getAveragePressure(avgPressureOfStroke)}
                title="All Average"
                graphLabel={avgGraphLabel}
                datasetsConfig={avgDatasetsConfig}
              />
              <DoughnutPressureGraph
                pressureValue={fabricDrawer.getAveragePressure()? fabricDrawer.getAveragePressure(): 0}
                title="Displayed Average"
                graphLabel={avgGraphLabel}
                datasetsConfig={avgDatasetsConfig}
              />
            </Box>
          </Box>
        }
        {
          (pointerY == 0 && pointerX == 0) ?<></>
          :<MoveNowBorderLinearProgress
          variant="determinate"
          value={nowPointPressure*100}
        />
        }
        {
          activeStep == 0 && 
          <>
            <Box sx={{ width: "100%",  paddingBottom: 2, borderBottom: "1px solid #ccc" }}>
              <Box className="white-text center" sx={{width: "100%", marginTop: 1,}}>
                <Typography fontSize={14} fontWeight="bold">
                  ストローク群筆圧
                </Typography>
              </Box>
              <Box className="white-text center" sx={{width: "100%"}}>
                <Typography fontSize={14} fontWeight="bold">
                  {`${basisPressure.toString()}${6-basisPressure.toString().length != 0 ? (basisPressure ==0 || basisPressure ==1)? (".0000"): ("0".repeat(6-basisPressure.toString().length)): ""}`}
                </Typography>
              
              <BorderLinearProgress
                variant="determinate"
                value={100-basisPressure*100}
              />
              </Box>
            </Box>
            <Box className="white-text center" sx={{width: "100%", marginTop: 3}}>
              <Typography fontSize={12} fontWeight="bold">
                これまでの筆圧グループ
              </Typography>
            </Box>
            <Box sx={{height: "40%", overflow: "scroll", overflowX: "hidden"}}>
              {
                historyGroupPressure.map((v: number, i: number) => (
                  <Box className="white-text center" sx={{ marginBottom: 2 }} key={i}>
                    <Typography fontSize={12}>
                      {`${v.toString()}${6-v.toString().length != 0 ? ("0".repeat(6-v.toString().length)): ""}`}
                    </Typography>
                    <SmallBorderLinearProgress
                      variant="determinate"
                      value={v*100}
                    />
                  </Box>
                ))
              }
            </Box>
          </>
        }
        <GraphStepper
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            Next
            {theme.direction === 'rtl' ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === 'rtl' ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            Back
          </Button>
        }
      />
      </Box>
      <Box className="center">
        <Box onClick={handleClickShowAllGroupBox}>
          <GradientButton text={isShowAllGroupBox? "グループを非表示":"グループ表示"} />
        </Box>
      </Box>
    </Box>
	);
}