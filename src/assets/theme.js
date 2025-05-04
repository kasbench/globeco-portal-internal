import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#174A6A', // Deep Blue
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#2CA6A4', // Teal/Green
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#F28C28', // Orange
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#E2B23A', // Gold/Yellow
      contrastText: '#174A6A',
    },
    background: {
      default: '#F5F7FA', // Light Gray
      paper: '#FFFFFF', // White
    },
    text: {
      primary: '#222B38', // Dark Gray
      secondary: '#174A6A', // Deep Blue
    },
  },
});

export default theme; 