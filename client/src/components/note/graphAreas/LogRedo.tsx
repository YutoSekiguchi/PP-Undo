import React, { useState } from "react";
import {
  Box,
  Button,
  Badge,
} from "@mui/material";
import { useAtom } from "jotai";
import styled from "@emotion/styled";
import { cyan } from '@mui/material/colors';
import { AllLogImageList } from "./AllLogImageList";
import { logNotifierCountAtom } from "@/infrastructures/jotai/drawer";
import { FabricDrawer } from "@/modules/fabricdrawer";
import { LogRedoIcon } from "./LogRedoIcon";
import Spacer from "@/components/common/Spacer";


export const LogRedo: React.FC<{fabricDrawer: FabricDrawer}> = ({ fabricDrawer }) => {
  const DisplayLogButton = styled(Button) ({
    color: '#fff',
    border: "2px double transparent",
    backgroundImage: "linear-gradient(rgb(13, 14, 33), rgb(13, 14, 33)), radial-gradient(circle at left top, rgb(1, 110, 218), rgb(217, 0, 192))",
    backgroundOrigin: "border-box",
    backgroundClip: "padding-box, border-box",
    '&:hover': {
      backgroundImage: "linear-gradient(rgb(50, 50, 50), rgb(30, 30, 33)), radial-gradient(circle at left top, rgb(1, 110, 218), rgb(217, 0, 192))",
      backgroundColor: cyan[700],
      color: '#fff',
    },
  })
  const [logNotifierCount, setLogNotifierCount] = useAtom(logNotifierCountAtom);
  const [isShowLog, setIsShowLog] = useState<boolean>(false);

  const showLog = () => {
    setIsShowLog(true);
  }

  const closeLog = () => {
    setIsShowLog(false);
    setLogNotifierCount(0);
  }

  return (
    <>
      <Box className="display-button-wrapper">
        <Badge badgeContent={logNotifierCount} color="info">
          <DisplayLogButton
            className="big-text center"
            onClick={showLog}
          >
            <LogRedoIcon />
            <Spacer size={6} />
            Display Log
          </DisplayLogButton>
        </Badge>
        {
          isShowLog&&
          <AllLogImageList
            closeLog={closeLog}
            fabricDrawer={fabricDrawer}
          />
        }
      </Box>
    </>
  );
}