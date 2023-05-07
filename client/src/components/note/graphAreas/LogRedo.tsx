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


export const LogRedo: React.FC<{fabricDrawer: FabricDrawer}> = ({ fabricDrawer }) => {
  const DisplayLogButton = styled(Button) ({
    backgroundColor:'#fff',
    color: '#1A2939',
    '&:hover': {
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
            className="big-text center display-button"
            onClick={showLog}
          >
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