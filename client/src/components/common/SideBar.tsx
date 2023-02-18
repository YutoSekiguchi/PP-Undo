import React from "react";
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
  const menuList = [
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
      <Box
        sx={{ width: 250 }}
        // role="presentation"
      >
      <List>
        {menuList.map((menu, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                { menu.icon }
              </ListItemIcon>
              <ListItemText primary={menu.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
    </>
  );
}