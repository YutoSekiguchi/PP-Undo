import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterConfig } from '@/configs/RouterConfig'
import { Box } from '@mui/material'
import './App.css'
import { Header } from './components/common/Header'
import { SideBar } from './components/common/SideBar'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'
import { blueGrey } from '@mui/material/colors';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: blueGrey,
    divider: blueGrey[700],
    background: {
      default: blueGrey[800],
    },
    text: {
      primary: '#fff',
      secondary: blueGrey[500],
    },
  }
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Header />
      <Box sx={{ display: 'flex' }}>
        <SideBar />
        <RouterConfig />
      </Box>
    </ThemeProvider>
  </React.StrictMode>,
)
