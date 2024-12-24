import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    button: {
      fontFamily: 'Comic Neue, sans-serif',
      fontWeight: 500
    },
    // menu: {
    //   fontFamily: "Comic Sans MS, cursive", // Custom font for MenuItem
    // }
  },
});

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
)
