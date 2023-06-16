import React from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import Visitors from './components/Visitors';
export const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Visitors />
    </LocalizationProvider>
  )
}

export default App;
