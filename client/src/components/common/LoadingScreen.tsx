import { Box } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Loading from '@/assets/loading.gif'

export const LoadingScreen: React.FC = () => {  
  return (
    <Box className='width100 height100 fixed center loading-screen'>
      <Box>
        <img src={Loading} alt="" />
        <h3 className='text text-center'>Loading</h3>
      </Box>
    </Box>
  );
}