import React from "react";
import { Link, useLocation, Location } from "react-router-dom";
import { SideBarMenuType } from "@/@types/common";
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
  HomeOutlined,
  NoteAddOutlined,
  CreateOutlined,
  SettingsOutlined
} from "@mui/icons-material"

export const SideBar:React.FC =() => {
  const location: Location = useLocation();
  const menuList: SideBarMenuType[] = [
    {
      label: "Home",
      icon: <HomeOutlined />
    },
    {
      label: "Create Note",
      icon: <NoteAddOutlined />
    },
    {
      label: "Try Demo",
      icon: <CreateOutlined />
    },
    {
      label: "Settings",
      icon: <SettingsOutlined />
    }
  ];

  return (
    <>
    {!notShowPathList.includes(location.pathname) &&
      <Box
        sx={{ width: 250 }}
        // role="presentation"
      >
      <List>
        {menuList.map((menu, index) => (
          <ListItem key={index} disablePadding>
            <Link to="/note">
              <ListItemButton>
                <ListItemIcon>
                  { menu.icon }
                </ListItemIcon>
                <ListItemText primary={menu.label} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
    }
    </>
  );
}