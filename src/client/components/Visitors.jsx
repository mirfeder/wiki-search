import { useEffect, useState } from 'react';
import { Box, Button, Grid, Stack, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs';

import IncomeAreaChart from './IncomeAreaChart';
import MainCard from './MainCard';
import CustomDay from './CustomDay';
import '../assets/static.css'
const Visitors = () => {

  const yesterday = dayjs().subtract(1, 'day');
  const [slot, setSlot] = useState('week');
  const [endDateValue, setEndDateValue] = useState(null);
  const [error, setError] = useState(null);
    

  const changeEndDateValue = (newValue) => {
    console.log(dayjs(newValue).toISOString().slice(0,10).replace(/-/g, '/'))
    setEndDateValue(newValue)
  }
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12} md={7} lg={8}>
        <Grid item>
          <Typography variant="h5">Search Sites With Most Pageviews</Typography>
        </Grid>
        <Grid container justifyContent="center" >
          <Grid item>
            <Stack 
              direction="row" 
              justifyContent="center"
              alignItems="center"
              spacing={2}>
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
      <MainCard content={false} sx={{ mt: 1.5 , minHeight: 360}}>
        
          <Stack direction="row" alignContent={'space-between'} >
          { (slot === 'week') ? (
              <>
                <DatePicker 
                  label="Select Month" 
                  value={endDateValue} 
                  disabled 
                  sx={{margin:2.5}} />
                <CustomDay />
              </>
            ) : (
              <>
                <DatePicker 
                  label="Select Month" 
                  value={endDateValue} 
                  onChange={(newValue) => changeEndDateValue(newValue)} 
                  maxDate={yesterday}
                  minDate={dayjs('2015-05-01')}
                  onError={(newError) => setError(newError)}
                  views={['month', 'year']}
                  openTo='month'
                  id='month-calendar'
                  name='month-calendar'
                  sx={{margin:2.5}}
                  />
                <CustomDay disabled />
              </>
            )
          }
          </Stack>
        </MainCard>
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