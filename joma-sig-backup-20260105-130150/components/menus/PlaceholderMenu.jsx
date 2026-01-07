import React from 'react';
import { Menu, MenuItem, Typography, Box } from '@mui/material';

const PlaceholderMenu = ({ anchorEl, open, onClose, onAction, title = "Menu" }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { minWidth: 200 }
      }}
    >
      <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle2" color="text.secondary">
          {title} - En développement
        </Typography>
      </Box>
      <MenuItem onClick={() => onAction(`${title.toLowerCase()}:action1`)}>
        Action 1
      </MenuItem>
      <MenuItem onClick={() => onAction(`${title.toLowerCase()}:action2`)}>
        Action 2
      </MenuItem>
      <MenuItem onClick={() => onAction(`${title.toLowerCase()}:action3`)}>
        Action 3
      </MenuItem>
      <MenuItem onClick={() => onAction(`${title.toLowerCase()}:test`)}>
        Test
      </MenuItem>
    </Menu>
  );
};

export default PlaceholderMenu;
