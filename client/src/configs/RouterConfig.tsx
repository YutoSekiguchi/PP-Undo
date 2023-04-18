import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from '@/components/common/Header'
import { SideBar } from '@/components/common/SideBar'
import { Box } from '@mui/material'
import { Home } from "@/pages/Home";
import { Note } from "@/pages/Note";
import { Notefolders } from "@/pages/NoteFolders";
import Spacer from "@/components/common/Spacer";

export const RouterConfig:React.FC =() => {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Box className="flex main">
          <SideBar />
          <Spacer size={250} />
            <Routes>
              <Route index element={<Home />} />
              <Route path="/notefolders/:pnfid" element={<Notefolders />} />
              <Route path='/note/:id' element={<Note />} />
            </Routes>
          </Box>
      </BrowserRouter>
    </>
  );
}