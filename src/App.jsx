import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import theme from './assets/theme';
import './assets/colors.css';
import SecurityTypeList from './SecurityTypeList';
import OrderStatusList from './OrderStatusList';
import TradeTypeList from './TradeTypeList';
import DestinationList from './DestinationList';
import OrderTypeList from './OrderTypeList';
import OrdersList from './OrdersList';
import SecurityList from './SecurityList';

const menuItems = [
  'Portfolio Management',
  'Research',
  'Data',
  'Operations',
  'Admin',
];

const portfolioSubMenu = [
  'Orders',
  'Trades',
  'Executions',
  'Maintenance',
];

const maintenanceDropdown = [
  'Security Type',
  'Blotter',
  'Trade Type',
  'Destination',
  'Order Type',
  'Order Status',
  'Security',
];

function App() {
  const [showPortfolioSubMenu, setShowPortfolioSubMenu] = useState(false);
  const [maintenanceAnchorEl, setMaintenanceAnchorEl] = useState(null);
  const [currentView, setCurrentView] = useState('');

  const handleMenuClick = (item) => {
    if (item === 'Portfolio Management') {
      setShowPortfolioSubMenu(true);
    } else {
      setShowPortfolioSubMenu(false);
      setMaintenanceAnchorEl(null);
      setCurrentView('');
    }
  };

  const handleSubMenuClick = (item, event) => {
    if (item === 'Maintenance') {
      setMaintenanceAnchorEl(event.currentTarget);
    } else {
      setMaintenanceAnchorEl(null);
      setCurrentView(item);
    }
  };

  const handleMaintenanceMenuClick = (option) => {
    setCurrentView(option);
    setMaintenanceAnchorEl(null);
  };

  const handleCloseMaintenance = () => {
    setMaintenanceAnchorEl(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <img
              src="/images/globeco-logo.png"
              alt="GlobeCo Logo"
              style={{ height: 56, marginRight: 24 }}
            />
            <Typography variant="h5" component="div" sx={{ flexGrow: 1, color: 'white', fontWeight: 600 }}>
              GlobeCo
            </Typography>
          </Box>
          {menuItems.map((item) => (
            <Button
              key={item}
              color="inherit"
              sx={{ fontWeight: 500, mx: 1 }}
              onClick={() => handleMenuClick(item)}
            >
              {item}
            </Button>
          ))}
        </Toolbar>
        {showPortfolioSubMenu && (
          <Toolbar sx={{ bgcolor: 'primary.dark', minHeight: 48 }}>
            {portfolioSubMenu.map((item) => (
              <Button
                key={item}
                color="inherit"
                sx={{ fontWeight: 500, mx: 1 }}
                onClick={item === 'Maintenance' ? (e) => handleSubMenuClick(item, e) : () => handleSubMenuClick(item)}
                aria-controls={item === 'Maintenance' && maintenanceAnchorEl ? 'maintenance-menu' : undefined}
                aria-haspopup={item === 'Maintenance'}
              >
                {item}
              </Button>
            ))}
            <Menu
              id="maintenance-menu"
              anchorEl={maintenanceAnchorEl}
              open={Boolean(maintenanceAnchorEl)}
              onClose={handleCloseMaintenance}
              MenuListProps={{ 'aria-labelledby': 'maintenance-button' }}
            >
              {maintenanceDropdown.map((option) => (
                <MenuItem key={option} onClick={() => handleMaintenanceMenuClick(option)}>
                  {option}
                </MenuItem>
              ))}
            </Menu>
          </Toolbar>
        )}
      </AppBar>
      <Container maxWidth="lg" sx={{ minHeight: '70vh', py: 6 }}>
        {currentView === 'Security Type' ? <SecurityTypeList /> : null}
        {currentView === 'Order Status' ? <OrderStatusList /> : null}
        {currentView === 'Trade Type' ? <TradeTypeList /> : null}
        {currentView === 'Destination' ? <DestinationList /> : null}
        {currentView === 'Order Type' ? <OrderTypeList /> : null}
        {currentView === 'Orders' ? <OrdersList /> : null}
        {currentView === 'Security' ? <SecurityList /> : null}
        {/* Body left intentionally blank for future content */}
      </Container>
      <Box component="footer" sx={{ bgcolor: 'background.default', py: 2, textAlign: 'center', borderTop: '1px solid #E5E9F2' }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} GlobeCo. This site and its content are licensed under the Apache License, Version 2.0.
        </Typography>
      </Box>
    </ThemeProvider>
  );
}

export default App;
