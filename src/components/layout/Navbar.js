import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import DownloadIcon from '@mui/icons-material/Download';
import Button from '@mui/material/Button';
import { useLocation } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
  const location = useLocation();
  
  // Helper function to get title based on current route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/upload':
        return 'Upload Excel Files';
      case '/charts':
        return 'Data Visualization';
      case '/export':
        return 'Export to PDF';
      default:
        return 'Data Visualization Tool';
    }
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1 
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          {getPageTitle()}
        </Typography>
        
        {/* Show export button only on charts page */}
        {location.pathname === '/charts' && (
          <Button 
            color="inherit" 
            startIcon={<DownloadIcon />}
            href="/export"
          >
            Export to PDF
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;