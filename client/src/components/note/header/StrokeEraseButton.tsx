import { useAtom } from 'jotai'
import { drawModeAtom } from "@/infrastructures/jotai/drawer";
import { FabricDrawer } from '@/modules/fabricdrawer';

export const StrokeEraseButton: React.FC<{fabricDrawer: FabricDrawer}> = ({ fabricDrawer }) => {
  const [drawMode, setDrawMode] = useAtom(drawModeAtom);

  const setEraseMode = () => {
    fabricDrawer.setDrawingMode();
    setDrawMode("strokeErase");
  }

  const strokeEraseIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="mode-svg" viewBox="0 0 199.997 200" stroke="currentColor">
      <path d="M235.177,4027.791l38.549-38.552,83.632-83.63-77.816-77.818-83.632,83.635-38.549,38.549Zm31.834-45.265L235.735,4013.8l-64.386-64.392,31.274-31.274Z" transform="translate(-157.361 -3827.791)"/>
    </svg>
  );

	return (
		<>
      <button
        className={drawMode == "strokeErase" ?"mode-button": "no-mode-button"}
        onClick={() => setEraseMode()}
      >
        {strokeEraseIcon}
      </button>
    </>
	);
}