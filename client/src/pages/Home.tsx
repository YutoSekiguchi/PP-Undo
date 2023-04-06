import { userDataAtom } from "@/infrastructures/jotai/authentication";
import { isAuth } from "@/modules/common/isAuth";
import { Box } from "@mui/material";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";

export const Home:React.FC =() => {
  

  return (
    <>
      {
        isAuth()
        ? <>
          <Box className="folder-list">
            
          </Box>
        </>
        : <h1>PP-Undo</h1>
      }
    </>
  );
}