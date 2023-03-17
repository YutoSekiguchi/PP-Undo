import React, { useEffect, useRef, useState } from "react";
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import { useAtom } from "jotai";
import { logNotifierCountAtom, logOfBeforePPUndoAtom } from "@/infrastructures/jotai/drawer";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import {
  Box,
  MobileStepper,
  Button,
  Badge,
} from "@mui/material";
import { LogRedoImageDialog } from "./LogRedoImageDialog";
import { LogImageListProps } from "@/@types/note";
import { CancelButton } from "./CancelButton";

export const LogImageList: React.FC<LogImageListProps> = (props) => {
  const { closeLog } = props;
  const displayLogCount = 3;
  const [dialogIndex, setDialogIndex] = useState<number>(-1); // -1は表示しない
  const insideRef = useRef<HTMLDivElement>(null);
  
  const [logOfBeforePPUndo, ] = useAtom(logOfBeforePPUndoAtom);
  const [logNotifierCount, ] = useAtom(logNotifierCountAtom);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [maxSteps, setMaxSteps] = useState<number>(Math.ceil(logOfBeforePPUndo.length/displayLogCount));
  const theme = useTheme();

  const LogImageStepper = styled(MobileStepper)({
    backgroundColor: '#eee',
    "& .MuiMobileStepper-dot": {
      backgroundColor: "#37474f55",
    },
    "& .MuiMobileStepper-dotActive": {
      backgroundColor: "#37474f"
    }
  });
  const StepperButton = styled(Button)({
    color: "#37474f",
    "&.Mui-disabled": {
      color: "#37474f55",
    }
  });


  const openDialog = (i: number) => {
    setDialogIndex(i);
  }
  const closeDialog = () => {
    setDialogIndex(-1);
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }

  useEffect(() => {
    setMaxSteps(Math.ceil(logOfBeforePPUndo.length/3));
  }, [logOfBeforePPUndo])

  const LogImage = (logImageProps: { i: number }) => {
    const { i } = logImageProps;
    return (
      <img className="log-image" src={logOfBeforePPUndo[logOfBeforePPUndo.length - (activeStep*displayLogCount+i) - 1].image}></img>
    );
  }

  const LogTimeText = (logTimeTextProps: { i: number }) => {
    const { i } = logTimeTextProps;
    return (
      <p>{logOfBeforePPUndo[logOfBeforePPUndo.length - (activeStep*displayLogCount+i) - 1].createTime}</p>
    );
  }


  return (
    <>
      {
        (dialogIndex != -1) && 
        <LogRedoImageDialog
          dialogIndex={dialogIndex}
          closeDialog={closeDialog}
          closeLog={closeLog}
        />
      }
      <Box className="log-image-container" ref={insideRef}>
        <CancelButton
          half
          close={closeLog}
        />
        <p className="log-image-total">全{logOfBeforePPUndo.length}個のログ</p>
        { maxSteps > 0 &&
          <LogImageStepper
            className="log-image-stepper"
            steps={maxSteps}
            activeStep={activeStep}
            nextButton={
              <StepperButton
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
              </StepperButton>
            }
            backButton={
              <StepperButton 
                size="small"
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
                Back
              </StepperButton>
            }
          />
        }
        {
          [...Array(displayLogCount)].map((_, i) => (
            <Box key={i}>
            { logOfBeforePPUndo.length > activeStep*3+i &&
              <Box
                className="log-image-wrapper"
                onClick={() => openDialog(logOfBeforePPUndo.length - (activeStep*displayLogCount+i) - 1)}
              >
                { activeStep*3+i < logNotifierCount
                  ? <>
                      <Badge badgeContent={"New"} color="error"> 
                        <LogImage i={i} />
                      </Badge>
                      <LogTimeText i={i} />
                    </>
                  : <>
                      <LogImage i={i} />
                      <LogTimeText i={i} />
                    </> 
                }
              </Box>
            }
            </Box>
          ))
        }
      </Box>
    </>
  )
}