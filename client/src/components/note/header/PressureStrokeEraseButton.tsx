import { useAtom } from 'jotai'
import { drawModeAtom } from "@/infrastructures/jotai/drawer";
import { FabricDrawer } from '@/modules/fabricdrawer';

export const PressureStrokeEraseButton: React.FC<{fabricDrawer: FabricDrawer}> = ({ fabricDrawer }) => {
  const [drawMode, setDrawMode] = useAtom(drawModeAtom);

  const setEraseMode = () => {
    fabricDrawer.setDrawingMode();
    setDrawMode("pressureStrokeErase");
  }

  const PressureStrokeEraseIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className='mode-pressure-stroke-erase-svg' viewBox="0 0 32 32" stroke="currentColor"><path d="M30.415 16.513l-7.927-7.927a2.001 2.001 0 0 0-2.83 0L5.622 22.624a2.002 2.002 0 0 0 0 2.83L10.166 30h9.591l10.658-10.659a2.001 2.001 0 0 0 0-2.828zM18.929 28h-7.934l-3.96-3.962l6.312-6.312l7.928 7.928zm3.76-3.76l-7.928-7.928L21.074 10l7.927 7.927z" fill="currentColor"></path><path d="M11 12H8V2h3a3.003 3.003 0 0 1 3 3v4a3.003 3.003 0 0 1-3 3zm-1-2h1a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-1z" fill="currentColor"></path><path d="M4 2H0v2h4v2H1v2h3v2H0v2h4a2.003 2.003 0 0 0 2-2V4a2.002 2.002 0 0 0-2-2z" fill="currentColor"></path></svg>
  );

	return (
		<>
      <button
        className={drawMode == "pressureStrokeErase" ?"mode-button": "no-mode-button"}
        onClick={() => setEraseMode()}
      >
        {PressureStrokeEraseIcon}
      </button>
    </>
	);
}