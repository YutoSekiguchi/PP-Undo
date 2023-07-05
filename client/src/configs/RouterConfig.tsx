import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from '@/components/common/Header'
import { SideBar } from '@/components/common/SideBar'
import { Box } from '@mui/material'
import { Home } from "@/pages/Home";
import { Note } from "@/pages/Note";
import { Notefolders } from "@/pages/NoteFolders";
import { Analytics } from "@/pages/Analytics";
import { Annotation } from "@/pages/Annotation";

export const RouterConfig:React.FC =() => {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Box className="flex main">
          <SideBar />
            <Routes>
              <Route index element={<Home />} />
              <Route path="/notefolders/:pnfid" element={<Notefolders />} />
              <Route path='/note/:id' element={<Note />} />
              <Route path='/demo' element={<Note />} />
              <Route path='/analytics' element={ <Analytics /> } />
              <Route path='/annotation/:nid' element={<Annotation />} />
            </Routes>
          </Box>
      </BrowserRouter>
    </>
  );
}