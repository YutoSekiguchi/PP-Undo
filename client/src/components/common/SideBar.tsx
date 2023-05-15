import React from "react";
import { Link, useLocation, Location } from "react-router-dom";
import { TSideBarMenu } from "@/@types/common";
import { notShowPathList } from "@/configs/NotShowPath";
import { 
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import {
  FolderCopyOutlined,
  FavoriteBorderOutlined,
  CreateOutlined,
  SettingsOutlined
} from "@mui/icons-material"
import lscache from "lscache";
import Spacer from "@/components/common/Spacer";

export const SideBar:React.FC =() => {
  const location: Location = useLocation();
  const menuList: TSideBarMenu[] = [
    {
      label: "My Folder",
      icon: <FolderCopyOutlined />,
      path: lscache.get('loginUserData')? '/notefolders/0': '/',
    },
    {
      label: "Try Demo",
      icon: <CreateOutlined />,
      path: '/demo',
    },
    {
      label: "Favorite",
      icon: <FavoriteBorderOutlined />,
      path: '/',
    },
    {
      label: "Settings",
      icon: <SettingsOutlined />,
      path: '/',
    }
  ];

  const checkDisplayPath = (path: string) => {
    var tmp: boolean = true;
    notShowPathList.map((notShowPath, _) => {
      if (path.indexOf(notShowPath) > -1) {
        tmp = false;
      }
    })
    return tmp;
  }

  return (
    <>
    {checkDisplayPath(location.pathname) &&
    <>
      <Box
        sx={{ width: 225 }} 
        className="sidebar"
      >
        <List>
          {menuList.map((menu, index) => (
            <ListItem key={index} disablePadding sx={{width: "100%"}}>
              <Link to={ menu.path } className="width100 sidebar-link">
                <ListItemButton>
                  <ListItemIcon>
                    { menu.icon }
                  </ListItemIcon>
                  <ListItemText className="text pointer" primary={menu.label} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
      </Box>
      <Spacer size={225} />
    </>
    }
    </>
  );
}