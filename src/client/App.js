import React from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import Visitors from './components/Visitors';
export const App = (props) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <Visitors />
      </div>
    </LocalizationProvider>
  )
}

export default App;
