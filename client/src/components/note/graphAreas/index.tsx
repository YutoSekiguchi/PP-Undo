import React, { useState } from "react";
import { useAtom } from 'jotai'
import { avgPressureOfStrokeAtom } from "@/infrastructures/jotai/drawer";
import {
  Box, Button, MobileStepper 
} from "@mui/material";
import { PPUndoArea } from "./PPUndoArea";
import { LogRedo } from "./LogRedo";
import { NowPressureGraphArea } from "./NowPressureLineGraph";
import { AvgPressureGraphArea } from "./AvgPressureLineGraph";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import { DoughnutPressureGraph } from "./DoughnutPressureGraph";
import { avgDatasetsConfig, avgGraphLabel, nowDatasetsConfig, nowGraphLabel } from "@/configs/DoughnutPressureGraphConfig";
import { averagePressure } from "@/modules/note/AveragePressure";

export const NoteGraphAreas: React.FC = () => {
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
  // const StepperButton = styled(Button)({
  //   color: "#37474f",
  //   "&.Mui-disabled": {
  //     color: "#37474f55",
  //   }
  // });
  // const {buttonColor, isChoice, colorChange, index} = props;
  // const [drawer, setDrawer] = useAtom(drawerAtom);

  // const buttonStyle: {backgroundColor: string} = {
  //   backgroundColor: `${buttonColor}`,
  // }
  
  // const changeColor = (color: string) => {
  //   colorChange(index);
  //   drawer.setStrokeColor(color);
  //   drawer.config.colors.originalPoint = color;
  //   setDrawer(drawer);
  // }

	return (
    <Box className="graph-area">
      <PPUndoArea />
      <LogRedo />
      <Box className="graph-wrapper graph-wrapper-height">
        {
          activeStep == 0 && 
          <>
            <NowPressureGraphArea />
            <AvgPressureGraphArea />
          </>
        }
        {
          activeStep == 1 && 
          <Box sx={{width: "100%", height: "100%", display: "flex", justifyContent: "space-around", alignItems: "center"}}>
            <DoughnutPressureGraph
              pressureValue={avgPressureOfStroke[avgPressureOfStroke.length-1]}
              title="Now"
              graphLabel={nowGraphLabel}
              datasetsConfig={nowDatasetsConfig}
            />
            <DoughnutPressureGraph
              pressureValue={averagePressure(avgPressureOfStroke)}
              title="Average"
              graphLabel={avgGraphLabel}
              datasetsConfig={avgDatasetsConfig}
            />
          </Box>
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