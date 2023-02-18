import React from "react";

export const Home:React.FC =() => {
  return (
    <>
      <h1>書けるよー</h1>
      <div className="canvasWrapper">
        <svg id="drawer" className="canvas write"></svg>
      </div>
    </>
  );
}