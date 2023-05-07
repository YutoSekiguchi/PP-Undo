import React from "react";
import { useAtom } from 'jotai'
import { drawModeAtom } from "@/infrastructures/jotai/drawer";
import { FabricDrawer } from "@/modules/fabricdrawer";

export const PenButton: React.FC<{fabricDrawer: FabricDrawer}> = ({ fabricDrawer }) => {
  const [drawMode, setDrawMode] = useAtom(drawModeAtom);
  const setPenMode = () => {
    fabricDrawer.setDrawingMode();
    setDrawMode("pen");
  }

  const penIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="mode-svg" viewBox="0 0 24 24" stroke="currentColor" fill="none">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );

	return (
		<>
      <button
        className={drawMode == "pen" ?"mode-button": "no-mode-button"}
        onClick={() => setPenMode()}
      >
        {penIcon}
      </button>
    </>
	);
}