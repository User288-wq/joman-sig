import React from 'react';
import { Menu, MenuItem } from '@mui/material';

const  = ({ anchorEl, open, onClose, onAction }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
    >
      <MenuItem onClick={() => onAction(':action1')}>
        Action 1
      </MenuItem>
      <MenuItem onClick={() => onAction(':action2')}>
        Action 2
      </MenuItem>
      <MenuItem onClick={() => onAction(':action3')}>
        Action 3
      </MenuItem>
    </Menu>
  );
};

export default ;
