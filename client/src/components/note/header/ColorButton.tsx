import { TColorButton } from "@/@types/note";
import { drawModeAtom } from "@/infrastructures/jotai/drawer";
import { useAtom } from "jotai";

export const ColorButton: React.FC<TColorButton> = (props) => {
  const {buttonColor, isChoice, setColor, fabricDrawer} = props;
  const [, setDrawMode] = useAtom(drawModeAtom);
  const buttonStyle: {backgroundColor: string} = {
    backgroundColor: `${buttonColor}`,
  }
  const changeColor = (newColor: string) => {
    setColor(newColor);
    fabricDrawer.setDrawingMode();
    setDrawMode("pen");
  }
  return (
    <button
      className={isChoice? "choice-color-button": "not-choice-color-button"}
      {... {style: buttonStyle}}
      onClick={() => changeColor(buttonColor)}
    ></button>
  );
}