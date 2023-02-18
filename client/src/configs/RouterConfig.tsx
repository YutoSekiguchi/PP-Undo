import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "@/pages/Home";
import { Note } from "@/pages/Note";

export const RouterConfig:React.FC =() => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path='/note' element={<Note />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}