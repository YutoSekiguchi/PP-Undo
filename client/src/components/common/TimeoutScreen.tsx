import { Box, Button } from "@mui/material";
import React from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import Spacer from "./Spacer";

export const TimeoutScreen: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();

  const handleNavigateHome = () => {
    navigate('/');
  }

  return (
    <Box className='timeout-screen'>
      <Box className="dialog">
          <Box className="text-center">
            <h2 className="text">セッションがタイムアウトしました。<br />再度ログインしてください。</h2>
            <Spacer size={45} />
            <Button
              variant="contained"
              color="error"
              onClick={handleNavigateHome}
            >
              HOMEに戻る
            </Button>
          </Box>
      </Box>
    </Box>
  );
}