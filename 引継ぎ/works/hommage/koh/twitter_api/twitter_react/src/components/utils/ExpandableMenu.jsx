import React, { useState } from "react";

import { Box, Menu, MenuItem } from "@mui/material";

export const ExpandableMenu = (props) => {
  const [anchorEl, setAnchorEl] = useState(false);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setAnchorEl(false);
  };

  const handleItemClick = (e, handleClick) => {
    e.stopPropagation();
    handleClick();
  };

  return (
    <>
      <Box
        sx={{
          zIndex: (theme) => theme.zIndex.speedDial + 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "5vh",
          width: "5vh",
          p: 0,
          "&:hover": {
            cursor: "pointer",
            background: "#E4E4E4",
            borderRadius: "50%",
            opacity: 0.99,
          },
        }}
        onClick={handleOpen}
      >
        {props.displayIcon}
      </Box>
      <Menu
        id="fade-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
      >
        {props.menuItems.map((item) => (
          <MenuItem
            key={item.title}
            sx={{ p: 1, fontWeight: "bold", color: item.fontColor }}
            onClick={(e) => handleItemClick(e, item.onClick)}
          >
            {item.icon} {item.title}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
