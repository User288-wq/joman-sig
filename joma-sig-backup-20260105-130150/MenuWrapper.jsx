import React from "react";
import { Menu, Box } from "@mui/material";

const MenuWrapper = ({ children, anchorEl, open, onClose, onAction }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      MenuListProps={{
        component: 'nav',
        sx: { 
          minWidth: 200,
          maxHeight: 400,
          overflowY: 'auto'
        }
      }}
    >
      <Box component="ul" sx={{ p: 0, m: 0 }}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { 
              onAction,
              onClose 
            });
          }
          return child;
        })}
      </Box>
    </Menu>
  );
};

export default MenuWrapper;