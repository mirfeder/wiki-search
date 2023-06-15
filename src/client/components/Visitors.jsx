import { useEffect, useState } from 'react';
import { Box, Button, Grid, Stack, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { DataGrid } from '@mui/x-data-grid'
import dayjs from 'dayjs';


import IncomeAreaChart from './IncomeAreaChart';
import MainCard from './MainCard';
import CustomDay from './CustomDay';

const Visitors = () => {

  const row = [{id: 0, article: '', views: ''}]
  const yesterday = dayjs().subtract(1, 'day');
  const [slot, setSlot] = useState('week');
  const [endDateValue, setEndDateValue] = useState(null);
  const [rows, setRows] = useState(row)
  const [error, setError] = useState(null);

  const columns =[
    {
      field: 'id',
      headerName: 'Rank',
      width: 0
    },
    {
      field: 'article',
      headerName: 'Article',
      width: 400
    },
    {
      field: 'views',
      headerName: 'Views',
      width: 150
    }
  ];   

  const changeEndDateValue = async (newValue) => {
    const url = '/api/monthly/'
    const fullUrl = url + dayjs(newValue).toISOString().slice(0,7).replace(/-/g, '/')
    setEndDateValue(newValue)
    response = await fetch(fullUrl)
    response = await response.json()
    if (response != undefined) {
      const newrows = []
      for (let i = 0; i < response['pageViews'].length; i++){
        newrows.push({
          article: response['pageViews'][i]['article'],
          views: new Intl.NumberFormat().format(response['pageViews'][i]['views']),
          id: response['pageViews'][i]['rank']
        })
      }
      setRows(newrows)
    }
  }

  const getWeek = async (selection) => {
    const start = selection.startOf('week');
    const end = selection.endOf('week');
    const days = []
    const body =  {dates: days}
    for (let i = 0; i < 7; i++){
      days.push(dayjs(start).add(i, 'day').toISOString().slice(0,10).replace(/-/g, '/'))
    }
    response = await fetch('/api/weekly', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)})
    response = await response.json()
    if (response != undefined) {
      const newrows = []
      for (let i = 0; i < response['pageViews'].length; i++){
        newrows.push({
          article: response['pageViews'][i][0],
          views: new Intl.NumberFormat().format(response['pageViews'][i][1]),
          id: i + 1
        })
      }
      setRows(newrows)
    }
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
                <CustomDay handler={getWeek}/>
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
                <CustomDay handler={getWeek} disabled />
              </>
            )
          }
          </Stack>
        </MainCard>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <Box sx={{ height: 1000, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 25,
                  },
                },
              }}
              pageSizeOptions={[25, 50]}
            />
          </Box>
          <Box sx={{ pt: 1, pr: 2 }}>
            <IncomeAreaChart slot={slot} />
          </Box>
        </MainCard>
      </Grid>
    </Grid>
  )
}

export default Visitors;