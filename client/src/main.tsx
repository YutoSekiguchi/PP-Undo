import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from "jotai";
import { RouterConfig } from '@/configs/RouterConfig'
import "@/styles/base.scss";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'
import { blueGrey } from '@mui/material/colors';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: blueGrey,
    divider: blueGrey[700],
    background: {
      default: blueGrey[900],
    },
    text: {
      primary: '#fff',
      secondary: blueGrey[500],
    },
  }
});

const lightTheme = createTheme({
  palette: {
    mode: "light",
    text: {
      primary: "#444746",
    }
  }
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
    <ThemeProvider theme={lightTheme}>
      <Provider>
        <CssBaseline />
        <RouterConfig />
      </Provider>
    </ThemeProvider>
  // </React.StrictMode>,
)
