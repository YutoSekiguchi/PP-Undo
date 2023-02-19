import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from '@/components/common/Header'
import { SideBar } from '@/components/common/SideBar'
import { Box } from '@mui/material'
import { Home } from "@/pages/Home";
import { Note } from "@/pages/Note";

export const RouterConfig:React.FC =() => {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Box sx={{ display: 'flex' }}>
          <SideBar />
          <Routes>
            <Route index element={<Home />} />
            <Route path='/note' element={<Note />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </>
  );
}