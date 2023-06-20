import React from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { configureTheme } from "igniteui-webcomponents";
import darkMaterial from "../../node_modules/igniteui-webcomponents/themes/dark/material.css?inline";
import material from "../../node_modules/igniteui-webcomponents/themes/light/material.css?inline;"

import Visitors from './components/Visitors';

export const ColorModeContext = React.createContext({ toggleColorMode: () => { } });

export const App = () => {

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Visitors />
    </LocalizationProvider>
  )
}
export default function ToggleColorMode() {
  const [mode, setMode] = React.useState('light');

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );
  configureTheme({theme: mode === 'light' ? material : darkMaterial})
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
