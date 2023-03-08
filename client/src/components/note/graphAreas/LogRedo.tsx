import React, { useState } from "react";
import {
  Box,
  Button,
  Badge,
} from "@mui/material";
import { useAtom } from "jotai";
import styled from "@emotion/styled";
import { cyan } from '@mui/material/colors';
import { LogImageList } from "./LogImageList";
import { logNotifierCountAtom } from "@/infrastructures/jotai/drawer";


export const LogRedo: React.FC = () => {
  const DisplayLogButton = styled(Button) ({
    backgroundColor: '#1A2939',
    color: '#fff',
    '&:hover': {
      backgroundColor: cyan[700],
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
        <Badge badgeContent={logNotifierCount} color="primary">
          <DisplayLogButton
            className="big-text center"
            onClick={showLog}
          >
            Display Log
          </DisplayLogButton>
        </Badge>
        {
          isShowLog&&
          <LogImageList
            closeLog={closeLog}
          />
        }
      </Box>
    </>
  );
}