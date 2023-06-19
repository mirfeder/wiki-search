import { React, useEffect, useState } from 'react';
import { Box, Button, Grid, Stack } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { DataGrid } from '@mui/x-data-grid'
import dayjs from 'dayjs';
import { calcDays, getArticleData } from './utils'


import PageViewChart from './PageViewChart';
import MainCard from './MainCard';
import CustomDay from './CustomDay';


const Visitors = () => {

  // have data grid display message when no data
  const NoDataFound = () => (
    <Stack height="100%" alignItems="center" justifyContent="center">
      No data to display
    </Stack>
  );
  // data grid initial state
  const rowInitialState = {
    slots: {
      noRowsOverlay: () => <NoDataFound />,
    },
    showColumnVerticalBorder: true,
    showCellVerticalBorder: true,
    pagination: {
      paginationModel: { pageSize: 15, page: 0 },
    },
  }
  const yesterday = dayjs().subtract(1, 'day');
  const [slot, setSlot] = useState('week');
  const [weekValue, setWeekValue] = useState(null)
  const [monthValue, setmonthValue] = useState(null);
  const [rows, setRows] = useState([])
  const [articleData, setArticleData] = useState([])
  const [article, setArticle] = useState('')
  const [, setGridState] = useState(rowInitialState)


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
      width: 200

    }
  ];
  /**
   * Gets data for monthly views. If partial month, gets daily views
   * @param {dayjs} newValue - selected month/year in date picker
   */
  const getMonthViews = async (newValue) => {
    let newrows = [];
    setmonthValue(newValue)
    const [start, end] = calcDays(newValue, 'months')
    if (newValue.$M == dayjs().month()) {
      newrows = await getDailyViews(start, end)
    } else {
      const url = '/api/monthly/'
      const fullUrl = url + dayjs(newValue).toISOString().slice(0, 7).replace(/-/g, '/')
      let response = await fetch(fullUrl)
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
  /**
   * Gets data for weekly views
   * @param {dayjs} selection = selected data
   */
  const getWeeklyViews = async (selection) => {
    setWeekValue(selection);
    const [start, end] = calcDays(selection, 'days')
    const newrows = await getDailyViews(start, end)
    setRows(newrows)
  }
  /**
   * Gets data for a sequence of days from "start" to "end"
   * @param {dayjs} start 
   * @param {dayjs} end 
   * @returns top 1000 articles viewed for the time period from start to end
   */
  const getDailyViews = async (start, end) => {
    const duration = dayjs(end).diff(start, 'days');
    const days = []
    const body = { dates: days }
    for (let i = 0; i <= duration; i++) {
      days.push(dayjs(start).add(i, 'day').toISOString().slice(0, 10).replace(/-/g, '/'))
    }
    let response = await fetch('/api/weekly', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    response = await response.json()
    if (response != undefined) {
      const newrows = []
      for (let i = 0; i < response['pageViews']?.length; i++) {
        newrows.push({
          article: response['pageViews'][i][0],
          views: new Intl.NumberFormat().format(response['pageViews'][i][1]),
          id: i + 1
        })
      }
      return newrows;
    }
    else {
      return [];
    }
  }
  /**
   * retrieves article name of selected row in grid
   * sets article data displayed in chart
   * @param {*} gridRowParams 
   */
  const getRowDetails = async (gridRowParams) => {
    const art = gridRowParams.row.article;
    setArticle(art)
    const viewData = await getArticleData(art, slot, weekValue, monthValue);
    setArticleData(viewData);
  }

  /** 
   * resets results grid and article chart when selection of weekly/monthly changes
   */
  useEffect(() => {
    setWeekValue(null)
    setmonthValue(null)
    setRows([])
    setArticle('')
    setArticleData([])
    setGridState(rowInitialState)
  }, [slot])

  /**
   * resets results grid and article chart when date selection changes
   */
  useEffect(() => {
    setRows([])
    setArticle('')
    setArticleData([])
    setGridState(rowInitialState)
  }, [monthValue, weekValue])

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
                  <CustomDay handler={getWeeklyViews} disable={false} />
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
                  <CustomDay handler={getWeeklyViews} disable={true} />
                </>
              )}
            </Stack>
            <Box sx={{ pt: 1, pr: 2, alignItems: 'flex-end' }}>
              <PageViewChart slot={slot} data={articleData} article={article} />
            </Box>
          </MainCard>
        </Grid>
        <Grid item gridColumn={2}>
          <MainCard content={false} sx={{ mt: 1.5, maxWidth: 600 }}>
            <Box sx={{
              minHeight: 839,
              width: '100%',
              '& .super-app-theme--header': {
                backgroundColor: 'Highlight',
              },
            }}>
              <DataGrid
                rows={rows}
                columns={columns}
                autoHeight={true}
                maxHeight={839}
                initialState={rowInitialState}
                onRowClick={(gridRowParams) => { getRowDetails(gridRowParams) }}
                slots={{
                  noRowsOverlay: () => <NoDataFound />,
                }}
                showColumnVerticalBorder={true}
                showCellVerticalBorder={true}
              />
            </Box>
          </MainCard>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Visitors;