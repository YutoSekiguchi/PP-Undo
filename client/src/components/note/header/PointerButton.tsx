import React from "react";
import { useAtom } from 'jotai'
import { drawModeAtom } from "@/infrastructures/jotai/drawer";
import { FabricDrawer } from "@/modules/fabricdrawer";

export const PointerButton: React.FC<{fabricDrawer: FabricDrawer | null}> = ({ fabricDrawer }) => {
  const [drawMode, setDrawMode] = useAtom(drawModeAtom);
  const setPointerMode = () => {
    fabricDrawer?.setPointingMode();
    setDrawMode("pointer");
  }

  const pointerIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="mode-svg" viewBox="1 1 16 16">
      <path fill="#fff0" d="M9,1L1,9l5.2,5.2L9,17l8-8L9,1z M7,12H6v-1h1V12z M7,7H6V6h1V7z M12,12h-1v-1h1V12z M11,6h1v1h-1V6z"/>
      <polygon points="15.6,9 13,6.2 13,8 9,8 5,8 5,6.2 2.4,9 5,11.8 5,10 9,10 13,10 13,11.8 "/>
      <polygon points="10,9 10,9 10,5 11.8,5 9,2.4 6.2,5 8,5 8,9 8,9 8,13 6.2,13 9,15.6 11.8,13 10,13 "/>
    </svg>
  );

	return (
		<>
      <button
        className={drawMode == "pointer" ?"mode-button": "no-mode-button"}
        onClick={() => setPointerMode()}
      >
        {pointerIcon}
      </button>
    </>
	);
}