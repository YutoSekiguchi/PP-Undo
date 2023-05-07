import React from "react";
import { Cancel } from "@mui/icons-material";
import { CancelButtonProps } from "@/@types/note";

export const CancelButton: React.FC<CancelButtonProps> = (props) => {
  const { half, fontSize, close } = props;
  return (
    <Cancel
      className={`close-button ${half && "half"}`}
      sx={{ fontSize: fontSize || 50 }}
      onClick={close}
    />
  );
}