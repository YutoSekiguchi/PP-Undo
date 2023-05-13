import { userDataAtom } from "@/infrastructures/jotai/authentication";
import { isAuth } from "@/modules/common/isAuth";
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
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
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Spacer from "@/components/common/Spacer";
import { fetchNoteFoldersTree } from "@/infrastructures/services/noteFolders";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { getNotesByNFIDAndUIDAtom } from "@/infrastructures/jotai/notes";
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';
import { Description } from "@mui/icons-material";
import { truncateString } from "@/modules/common/truncateString";
import { deleteNote } from "@/infrastructures/services/note";
import { LoadingScreen } from "@/components/common/LoadingScreen";

export const Notefolders: React.FC = () => {
  const [isNewFolderDialog, setIsNewFolderDialog] = useState<boolean>(false);
  const [isNewNoteDialog, setIsNewNoteDialog] = useState<boolean>(false);
  const [isEditNoteDialog, setIsEditNoteDialog] = useState<boolean>(false);
  const params: Params<string> = useParams();
  const [noteFoldersData, setNoteFoldersData] = useState<NoteFoldersDataType[]>([]);
  const [notesData, setNotesData] = useState<NoteDataType[]>([]);
  const [treeData, setTreeData] = useState<NoteFoldersDataType[]>([]);
  const [loginUserData, ] = useAtom(userDataAtom);
  const [, getFolders] = useAtom(getFoldersAtom);
  const [, getNotesByNFIDAndUID] = useAtom(getNotesByNFIDAndUIDAtom);
  const [selectedNoteID, setSelectedNoteID] = useState<number | null>(null);
  const [selectedNoteTitle, setSelectedNoteTitle] = useState<string | null>(null);
  const [noteAnchorEl, setNoteAnchorEl] = useState<null | HTMLElement>(null);
  const [isChange, setIsChange] = useState<boolean>(false);
  const noteMenuOpen = Boolean(noteAnchorEl);

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

  const handleOpenMenu = (event: any, id: number, title: string) => {
    event.stopPropagation();
    setSelectedNoteID(id);
    setSelectedNoteTitle(title)
    setNoteAnchorEl(event.currentTarget);
  }

  const openEditNoteDialog = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    event.stopPropagation();
    setIsEditNoteDialog(true);
  }

  const closeEditNoteDialog = () => {
    setTimeout(() => {
      loadData();
      setNoteAnchorEl(null);
      setIsChange(false);
    }, 1000)
    setIsEditNoteDialog(false);
  }

  
  const handleDeleteNote = async (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    event.stopPropagation();
    setIsChange(true);
    const id = selectedNoteID;
    if (id == null) { return; }
    await deleteNote(id);
    setTimeout(() => {
      loadData();
      setNoteAnchorEl(null);
      setIsChange(false);
    }, 1000)
  }

  const loadData = async() => {
    const userData = lscache.get('loginUserData');
    if (userData === null) {
      navigate(`/`);
    }
    const uid = Number(userData.ID);
    const pnfid = Number(params.pnfid);
    setNoteFoldersData(await getFolders({
      UID: uid,
      PNFID: pnfid
    }));
    setNotesData(await getNotesByNFIDAndUID({
      PNFID: pnfid,
      UID: uid
    }));
    if (pnfid != 0) { setTreeData(await fetchNoteFoldersTree(pnfid)); } 
  }



  useEffect(() => {
    // const userData = lscache.get('loginUserData');
    // if (userData === null) {
    //   navigate(`/`);
    // }
    // const uid = Number(userData.ID);
    // const pnfid = Number(params.pnfid);
    loadData();
  }, [params])

  return (
    <>
      {
        isChange &&
        <LoadingScreen />
      }
      {
        isAuth()
        ? <>
          <AddNoteOrFolderDialog 
            type="folder"
            open={isNewFolderDialog}
            closeDialog={closeNewFolderDialog}
            setNoteFoldersData={setNoteFoldersData}
            setIsChange={setIsChange}
          />
          <AddNoteOrFolderDialog 
            type="note"
            open={isNewNoteDialog}
            closeDialog={closeNewNoteDialog}
            setNotesData={setNotesData}
            setIsChange={setIsChange}
          />
          {
            (selectedNoteID !== null && selectedNoteTitle !== null) &&
            <AddNoteOrFolderDialog 
              type="note"
              open={isEditNoteDialog}
              edit={{id: selectedNoteID, title: selectedNoteTitle}}
              closeDialog={closeEditNoteDialog}
              setNotesData={setNotesData}
              setIsChange={setIsChange}
            />
          }

          <Box className="note-folders-page-body">
            <Box className="flex tree">
              <Box 
                className="center pointer"
                onClick={() => navigate(`/notefolders/0`)}
              >
                <Typography component="div">
                  <Box className="tree-text">
                    マイフォルダ
                  </Box>
                </Typography>
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
                          <Typography component="div">
                            <Box className="tree-text">
                              {truncateString(tree.Name)}
                            </Box>
                          </Typography>
                          <KeyboardArrowRightIcon />
                        </Box>
                      );
                    })
                  }
                </>
              }
            </Box>
              <Box className="flex-start notefolders-subtitle">
                <Typography variant="body1" fontWeight="bold">フォルダ一覧</Typography>
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
                            <Box className="folder-box-left">
                              <FolderIcon sx={{ fontSize: 24 }} className="folder-icon" />
                              <Typography variant="body2">{truncateString(noteFolderData.Name)}</Typography>
                            </Box>
                            <MoreVertIcon className="more-vert-icon" />
                          </Box>
                        );
                      })
                    }
                  </>
                  : 
                  <Box className="text-center width100">
                    <Typography variant="body1" fontWeight="bold">該当フォルダ無し</Typography>
                  </Box>
                }
              </Box>

            <Spacer size={40}  />

            <Box className="flex-start notefolders-subtitle">
              <Typography variant="body1" fontWeight="bold">ノート一覧</Typography>
              <NewButton
                size="small"
                startIcon={<AddRoundedIcon />}
                onClick={openNewNoteDialog}
              >
                新規ノート
              </NewButton>
            </Box>
            <Box className="file-list">
              {
                notesData?.length > 0
                ? <>
                  {
                    notesData.map((noteData, i) => {
                      const handleNoteMenuClose = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
                        event.stopPropagation();
                        setNoteAnchorEl(null);
                      };
                      return (
                        <Box key={i} className="text-center file-box pointer" onClick={() => navigate(`/note/${noteData.ID}`)}>
                          <Box className="file-box-header">
                            <Box className="file-box-header-left">
                              <Description sx={{ fontSize: 16 }} className="note-title-icon" />
                              <Box className="note-text">{noteData.Title}</Box>
                            </Box>
                            <MoreVertIcon
                              className="more-vert-icon"
                              onClick={event => handleOpenMenu(event, noteData.ID, noteData.Title)}
                            />
                            <Menu
                              anchorEl={noteAnchorEl}
                              open={noteMenuOpen}
                              onClose={ handleNoteMenuClose}
                              elevation={0}
                              sx={{
                                width: 200,
                              }}
                            >
                              <MenuItem
                                onClick={event => openEditNoteDialog(event)}
                              >
                                <DriveFileRenameOutlineIcon />
                                Edit
                              </MenuItem>
                              <MenuItem
                                onClick={event => handleDeleteNote(event)}
                              >
                                <DeleteOutlineIcon />
                                Delete
                              </MenuItem>
                            </Menu>
                          </Box>
                          {
                            noteData.NoteImage==""
                            ? <Box className="center note-background">
                                <DescriptionTwoToneIcon sx={{ fontSize: 120 }} className="note-icon" />
                              </Box>
                            : <Box sx={{
                                backgroundImage: `url(${noteData.BackgroundImage})`,
                                backgroundSize: "cover",
                                margin: "0 auto",
                                borderRadius: "5%"
                              }} width={240} height={210}>
                              <img src={noteData.NoteImage} width={240} height={210} />
                            </Box>
                          }
                        </Box>
                      );
                    })
                  }
                </>
                : 
                <Box className="text-center width100">
                  <Typography variant="body1" fontWeight="bold">該当ファイル無し</Typography>
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