import { useState } from 'react';
import { Box, Button, Grid, Stack, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { DataGrid } from '@mui/x-data-grid'
import dayjs from 'dayjs';
import Path from 'path'

import IncomeAreaChart from './IncomeAreaChart';
import MainCard from './MainCard';
import CustomDay from './CustomDay';

const Visitors = () => {

  const row = [{ id: 0, article: '', views: '' }]
  const yesterday = dayjs().subtract(1, 'day');
  const [slot, setSlot] = useState('week');
  const [weekValue, setWeekValue] = useState(null)
  const [monthValue, setmonthValue] = useState(null);
  const [rows, setRows] = useState(row)
  const [articleData, setArticleData] = useState([0, 0, 0, 0, 0, 0, 0])


  const columns = [
    {
      field: 'id',
      headerName: 'Rank',
      headerClassName: 'super-app-theme--header',
      width: 40
    },
    {
      field: 'article',
      headerName: 'Article',
      headerClassName: 'super-app-theme--header',
      width: 300
    },
    {
      field: 'views',
      headerName: 'Views',
      headerClassName: 'super-app-theme--header',
      width: 500

    }
  ];

  const getMonthViews = async (newValue) => {
    let newrows = [];
    setmonthValue(newValue)
    const [start, end] = calcDays(newValue, 'months')
    if (newValue.$M == dayjs().month()) {
      newrows = await getDailyViews(start, end)
    } else {
      const url = '/api/monthly/'
      const fullUrl = url + dayjs(newValue).toISOString().slice(0, 7).replace(/-/g, '/')
      response = await fetch(fullUrl)
      response = await response.json()
      if (response != undefined) {
        for (let i = 0; i < response['pageViews'].length; i++) {
          newrows.push({
            article: response['pageViews'][i]['article'],
            views: new Intl.NumberFormat().format(response['pageViews'][i]['views']),
            id: response['pageViews'][i]['rank']
          })
        }
      }
    }
    setRows(newrows)
  }

  const calcDays = (selection, type) => {
    let start, end
    if (type == 'months') {
      if (selection.$M == dayjs().month()) {
        start = selection.startOf('month');
        end = yesterday;
      } else {
        start = selection.startOf('month');
        end = selection.endOf('month');
      }
    } else {
      start = selection.startOf('week');
      end = selection.endOf('week');
      if (dayjs(end).isAfter(yesterday)) {
        end = yesterday;
      };
    }

    return [start, end]
  }

  const getDailyViews = async (start, end) => {
    const duration = dayjs(end).diff(start, 'days');
    const days = []
    const body = { dates: days }
    for (let i = 0; i <= duration; i++) {
      days.push(dayjs(start).add(i, 'day').toISOString().slice(0, 10).replace(/-/g, '/'))
    }
    response = await fetch('/api/weekly', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    response = await response.json()
    if (response != undefined) {
      const newrows = []
      for (let i = 0; i < response['pageViews'].length; i++) {
        newrows.push({
          article: response['pageViews'][i][0],
          views: new Intl.NumberFormat().format(response['pageViews'][i][1]),
          id: i + 1
        })
      }
      return newrows;
    }
    else {
      return row;
    }
  }
  const getWeeklyViews = async (selection) => {
    setWeekValue(selection);
    const [start, end] = calcDays(selection, 'days')
    const newrows = await getDailyViews(start, end)
    setRows(newrows)
  }

  const formattedDate = (selection) => {
    return dayjs(selection).toISOString().slice(0, 10).replace(/-/g, '');
  }

  const getRowDetails = async (gridRowParams) => {
    const article = gridRowParams.row.article;
    let start, end;
    if (slot == 'week') {
      [start, end] = calcDays(weekValue, 'days')

    } else {
      if (monthValue != null && monthValue != undefined) {
        [start, end] = calcDays(monthValue, 'months')
      } else {
        return
      }
    }
    const url = '/api/article/'
    const fullUrl = Path.join(url, article, formattedDate(start), formattedDate(end))
    console.log(fullUrl)
    let response = await fetch(fullUrl)
    response = await response.json()
    console.log(response['pageViews'])
    const arr = response['pageViews']
    if (response != undefined) {
      const viewData = slot === 'week'
        ? new Array(7).fill(0)
        : new Array(31).fill(0)
      for (let i = 0; i < arr.length; i++) {
        if (slot === 'week') {
          switch (dayjs(arr[i]['timestamp'].slice(0, 8)).day()) {
            case 0:
              viewData[0] = arr[i]['views']
              break;
            case 1:
              viewData[1] = arr[i]['views']
              break;
            case 2:
              viewData[2] = arr[i]['views']
              break;
            case 3:
              viewData[3] = arr[i]['views']
              break;
            case 4:
              viewData[4] = arr[i]['views']
              break;
            case 5:
              viewData[5] = arr[i]['views']
              break;
            case 6:
              viewData[6] = arr[i]['views']
              break;
            default:
              console.log(dayjs(arr[i]['timestamp'].slice(0, 8)).day())
          }
        } else {
          const d = parseInt(arr[i]['timestamp'].slice(6, 8) - 1)
          viewData[d] = arr[i]['views']
        }
      }
      setArticleData(viewData);
      console.log(viewData, articleData)
    }

  }

  return (
    <Grid container >
      <Grid container rowSpacing={4.5} justifyContent="left" spacing={2} columns={2}>
        <Grid item gridColumn={1}>
          <MainCard content={false} sx={{ mt: 1.5, minHeight: 360, maxWidth: 600, justifyContent: 'space-around' }}>
          <Stack
          direction="row"
          justifyContent="center"
          witdth='auto'
          spacing={3}
        >
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
            <Stack direction="row" alignContent={'space-between'} >
              {(slot === 'week') ? (
                <>
                  <DatePicker
                    label="Select Month"
                    value={monthValue}
                    disabled
                    sx={{ margin: 2.5 }} />
                  <CustomDay handler={getWeeklyViews} />
                </>
              ) : (
                <>
                  <DatePicker
                    label="Select Month"
                    value={monthValue}
                    onChange={(newValue) => getMonthViews(newValue)}
                    maxDate={yesterday}
                    minDate={dayjs('2015-05-01')}
                    onError={(newError) => setError(newError)}
                    views={['month', 'year']}
                    openTo='month'
                    id='month-calendar'
                    name='month-calendar'
                    sx={{ margin: 2.5 }}
                  />
                  <CustomDay handler={getWeeklyViews} disabled />
                </>
              )
              }
            </Stack>
            <Box sx={{ pt: 1, pr: 2, alignItems: alignItems = 'flex-end' }}>
              <IncomeAreaChart slot={slot} data={articleData} />
            </Box>
          </MainCard>
        </Grid>
        <Grid item gridColumn={2}>
          <MainCard content={false} sx={{ mt: 1.5, maxWidth: 600 }}>
            <Box sx={{
              minHeight: 810,
              width: '100%',
              '& .super-app-theme--header': {
                backgroundColor: 'Highlight',
              },
            }}>
              <DataGrid
                rows={rows}
                columns={columns}
                minHeight={800}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 25,
                    },
                  },
                }}
                pageSizeOptions={[25, 50]}
                onRowClick={(gridRowParams) => { getRowDetails(gridRowParams) }}
              />
            </Box>

          </MainCard>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Visitors;