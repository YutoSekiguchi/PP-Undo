import { userDataAtom } from "@/infrastructures/jotai/authentication";
import { isAuth } from "@/modules/common/isAuth";
import { Box, Button } from "@mui/material";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { styled } from '@mui/system';
import { AddFolderDialog } from "@/components/home/AddFolderDialog";

export const Notefolders: React.FC = () => {
  const [isNewFolderDialog, setIsNewFolderDialog] = useState<boolean>(false);
  const [loginUserData, ] = useAtom(userDataAtom);

  const NewButton = styled(Button)({
    backgroundColor: "white",
    padding: "15px 10px",
    marginRight: "20px",
    "&:hover" : {
      backgroundColor: "#ddd",
    }
  });

  const closeNewFolderDialog = () => {
    setIsNewFolderDialog(false);
  }

  const openAddFolder = () => {
    setIsNewFolderDialog(true);
  }

  useEffect(() => {
    console.log(isAuth());
    console.log(loginUserData);
  }, [])

  return (
    <>
      {
        isAuth() || loginUserData != null
        ? <>
          <AddFolderDialog 
            open={isNewFolderDialog}
            closeDialog={closeNewFolderDialog}
          />
          <Box className="folder-list">

            <Box className="button-group">
              <NewButton
                size="medium"
                startIcon={<AddRoundedIcon />}
                onClick={openAddFolder}
              >
                新規フォルダ
              </NewButton>
              <NewButton
                size="medium"
                startIcon={<AddRoundedIcon />}
              >
                新規ノート
              </NewButton>
            </Box>
            
          </Box>
        </>
        :
        <></>
      }
    </>
  );
}