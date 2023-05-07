import React from "react";
import { Cancel } from "@mui/icons-material";
import { TCancelButtonProps } from "@/@types/note";

export const CancelButton: React.FC<TCancelButtonProps> = (props) => {
  const { half, fontSize, close } = props;
  return (
    <Cancel
      className={`close-button ${half && "half"}`}
      sx={{ fontSize: fontSize || 50 }}
      onClick={close}
    />
  );
}