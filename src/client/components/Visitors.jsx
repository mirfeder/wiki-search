import { useState } from 'react';
import { Box, Button, Grid, Stack, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { DateTimePicker } from 'react-datetime-pickers';

import IncomeAreaChart from './IncomeAreaChart';
import MainCard from './MainCard';
import CustomDay from './CustomDay';
const Visitors = () => {

  const yesterday = dayjs().subtract(1, 'day');
  const [slot, setSlot] = useState('week');
  const [startDateValue, setStartDateValue] = useState(yesterday);
  const [endDateValue, setEndDateValue] = useState(null)
  const [error, setError] = useState(null)
  
  const changeEndDateValue = (newValue) => {
    console.log(newValue.$d)
    setEndDateValue(newValue)
  }
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12} md={7} lg={8} alignItems="left">
        <CustomDay />
        <DatePicker label="End Date" value={endDateValue} onChange={(newValue) => changeEndDateValue(newValue)} />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Unique Visitors</Typography>
          </Grid>
          <Grid item>
            <Stack direction="row" alignItems="center" spacing={0}>
              <Button
                size="small"
                onClick={() => setSlot('month')}
                color={slot === 'month' ? 'primary' : 'secondary'}
                variant={slot === 'month' ? 'outlined' : 'text'}
              >
                Month
              </Button>
              <Button
                size="small"
                onClick={() => setSlot('week')}
                color={slot === 'week' ? 'primary' : 'secondary'}
                variant={slot === 'week' ? 'outlined' : 'text'}
              >
                Week
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <IncomeAreaChart slot={slot} />
          </Box>
        </MainCard>
      </Grid>
    </Grid>
  )
}

export default Visitors;