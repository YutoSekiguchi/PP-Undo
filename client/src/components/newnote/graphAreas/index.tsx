import React, { useEffect, useState } from "react";
import { useAtom } from 'jotai'
import { avgPressureOfStrokeAtom } from "@/infrastructures/jotai/drawer";
import {
  Box, Button, MobileStepper 
} from "@mui/material";
import { PPUndoArea } from "./PPUndoArea";
import { LogRedo } from "./LogRedo";
// import { NowPressureGraphArea } from "./NowPressureLineGraph";
// import { AvgPressureGraphArea } from "./AvgPressureLineGraph";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import { DoughnutPressureGraph } from "./DoughnutPressureGraph";
import { avgDatasetsConfig, avgGraphLabel, nowDatasetsConfig, nowGraphLabel } from "@/configs/DoughnutPressureGraphConfig";
import { averagePressure } from "@/modules/note/AveragePressure";
import { NowPressure } from "@/modules/note/NowPressure";
import { FabricDrawer } from "@/modules/fabricdrawer";

export const NoteGraphAreas: React.FC<{fabricDrawer: FabricDrawer | null}> = ({ fabricDrawer }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = 2;
  const [avgPressureOfStroke, ] = useAtom(avgPressureOfStrokeAtom);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

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
      <LogRedo fabricDrawer={fabricDrawer} />
      <Box className="graph-wrapper graph-wrapper-height">
        {
          activeStep == 0 && 
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
                pressureValue={averagePressure(avgPressureOfStroke)}
                title="All Average"
                graphLabel={avgGraphLabel}
                datasetsConfig={avgDatasetsConfig}
              />
              <DoughnutPressureGraph
                pressureValue={fabricDrawer?.getAveragePressure()? fabricDrawer.getAveragePressure(): 0}
                title="Displayed Average"
                graphLabel={avgGraphLabel}
                datasetsConfig={avgDatasetsConfig}
              />
            </Box>
          </Box>
        }
        {
          activeStep == 1 && 
          <>
            {/* <NowPressureGraphArea /> */}
            {/* <AvgPressureGraphArea /> */}
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
      
    </Box>
	);
}