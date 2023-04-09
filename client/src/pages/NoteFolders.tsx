import { userDataAtom } from "@/infrastructures/jotai/authentication";
import { isAuth } from "@/modules/common/isAuth";
import { Box, Button } from "@mui/material";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { styled } from '@mui/system';
import { AddNoteOrFolderDialog } from "@/components/notefolder/AddNoteOrFolderDialog";
import { NoteDataType, NoteFoldersDataType } from "@/@types/notefolders";
import { Params, useNavigate, useParams } from "react-router-dom";
import { getFoldersAtom } from "@/infrastructures/jotai/noteFolders";
import lscache from "lscache";
import FolderIcon from '@mui/icons-material/Folder';
import Spacer from "@/components/common/Spacer";
import { fetchNoteFoldersTree } from "@/infrastructures/services/noteFolders";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { getNotesByNFIDAtom } from "@/infrastructures/jotai/notes";
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';

export const Notefolders: React.FC = () => {
  const [isNewFolderDialog, setIsNewFolderDialog] = useState<boolean>(false);
  const [isNewNoteDialog, setIsNewNoteDialog] = useState<boolean>(false);
  const params: Params<string> = useParams();
  const [noteFoldersData, setNoteFoldersData] = useState<NoteFoldersDataType[]>([]);
  const [notesData, setNotesData] = useState<NoteDataType[]>([]);
  const [treeData, setTreeData] = useState<NoteFoldersDataType[]>([]);
  const [loginUserData, ] = useAtom(userDataAtom);
  const [, getFolders] = useAtom(getFoldersAtom);
  const [, getNotesByNFID] = useAtom(getNotesByNFIDAtom);
  const navigate = useNavigate();

  const NewButton = styled(Button)({
    backgroundColor: "white",
    marginLeft: "20px",
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

  const closeNewNoteDialog = () => {
    setIsNewNoteDialog(false);
  }
  const openNewNoteDialog = () => {
    setIsNewNoteDialog(true);
  }

  useEffect(() => {
    const func = async(uid: number, pnfid: number) => {
      setNoteFoldersData(await getFolders({
        UID: uid,
        PNFID: pnfid
      }));
      setNotesData(await getNotesByNFID(pnfid));
      if (pnfid != 0) { setTreeData(await fetchNoteFoldersTree(pnfid)); } 
    }
    const userData = lscache.get('loginUserData');
    const uid = Number(userData.ID);
    const pnfid = Number(params.pnfid);
    func(uid, pnfid);
  }, [params])

  return (
    <>
      {
        isAuth() || loginUserData != null
        ? <>
          <AddNoteOrFolderDialog 
            type="folder"
            open={isNewFolderDialog}
            closeDialog={closeNewFolderDialog}
            setNoteFoldersData={setNoteFoldersData}
          />
          <AddNoteOrFolderDialog 
            type="note"
            open={isNewNoteDialog}
            closeDialog={closeNewNoteDialog}
            setNotesData={setNotesData}
          />

          <Box className="note-folders-page-body width100">
            <Box className="flex tree">
              <Box 
                className="center pointer"
                onClick={() => navigate(`/notefolders/0`)}
              >
                <p className="tree-text">root</p>
                <KeyboardArrowRightIcon />
              </Box>
              {
                params.pnfid!="0" &&
                <>
                  {
                    treeData?.map((tree, i) => {
                      return (
                        <Box 
                          className="center pointer"
                          key={i}
                          onClick={() => navigate(`/notefolders/${tree.ID}`)}
                        >
                          <p className="tree-text">{tree.Name}</p>
                          <KeyboardArrowRightIcon />
                        </Box>
                      );
                    })
                  }
                </>
              }
            </Box>
            
            <Box className="flex-start">
              <h3>フォルダ一覧</h3>
              <NewButton
                size="small"
                startIcon={<AddRoundedIcon />}
                onClick={openAddFolder}
              >
                新規フォルダ
              </NewButton>
            </Box>
            <Box className="folder-list">
              {
                noteFoldersData?.length > 0
                ? <>
                  {
                    noteFoldersData.map((noteFolderData, i) => {
                      return (
                        <Box key={i} className="text-center folder-box pointer" onClick={() => navigate(`/notefolders/${noteFolderData.ID}`)}>
                          <FolderIcon sx={{ fontSize: 120 }} className="folder-icon" />
                          <p className="text">{noteFolderData.Name}</p>
                        </Box>
                      );
                    })
                  }
                </>
                : 
                <Box className="text-center width100">
                  <h4>該当フォルダ無し</h4>
                </Box>
              }
            </Box>

            <Spacer size={40}  />

            <Box className="flex-start">
              <h3>ノート一覧</h3>
              <NewButton
                size="small"
                startIcon={<AddRoundedIcon />}
                onClick={openNewNoteDialog}
              >
                新規ノート
              </NewButton>
            </Box>
            <Box className="folder-list">
              {
                notesData?.length > 0
                ? <>
                  {
                    notesData.map((noteData, i) => {
                      return (
                        <Box key={i} className="text-center folder-box pointer" onClick={() => navigate(`/notefolders/${noteData.ID}`)}>
                          <DescriptionTwoToneIcon sx={{ fontSize: 200 }} className="folder-icon" />
                          <p className="text">{noteData.Title}</p>
                        </Box>
                      );
                    })
                  }
                </>
                : 
                <Box className="text-center width100">
                  <h4>該当フォルダ無し</h4>
                </Box>
              }
            </Box>
          </Box>

        </>
        :
        <></>
      }
    </>
  );
}