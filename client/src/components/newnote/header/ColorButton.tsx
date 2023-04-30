import { TColorButton } from "@/@types/newnote";

export const ColorButton: React.FC<TColorButton> = (props) => {
  const {buttonColor, isChoice, index, setColor} = props;
  const buttonStyle: {backgroundColor: string} = {
    backgroundColor: `${buttonColor}`,
  }
  const changeColor = (index: number, newColor: string) => {
    setColor(newColor);
  }
  return (
    <button
      className={isChoice? "choice-color-button": "not-choice-color-button"}
      {... {style: buttonStyle}}
      onClick={() => changeColor(index, buttonColor)}
    ></button>
  );
}