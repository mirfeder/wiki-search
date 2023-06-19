/* eslint-disable react/prop-types */
import * as React from 'react';
import { useState } from 'react';
import dayjs from 'dayjs';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';

dayjs.extend(isBetweenPlugin);

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) =>
    prop !== 'dayIsBetween' && prop !== 'isFirstDay' && prop !== 'isLastDay',
})(({ theme, dayIsBetween, isFirstDay, isLastDay }) => ({
  ...(dayIsBetween && {
    borderRadius: 0,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
  ...(isFirstDay && {
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%',
  }),
  ...(isLastDay && {
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%',
  }),
}));

function Day(props) {
  const { day, selectedDay, ...other } = props;

  if (selectedDay == null) {
    return <PickersDay day={day} {...other} />;
  }
  const yesterday = dayjs().subtract(1, 'day');
  const start = selectedDay.startOf('week');
  let end = selectedDay.endOf('week');
  if (dayjs(end).isAfter(yesterday)) {
    end = yesterday;
  }

  const dayIsBetween = day.isBetween(start, end, null, '[]');
  const isFirstDay = day.isSame(start, 'day');
  const isLastDay = day.isSame(end, 'day');

  return (
    <CustomPickersDay
      {...other}
      day={day}
      sx={dayIsBetween ? { px: 2.5, mx: 0 } : {}}
      dayIsBetween={dayIsBetween}
      isFirstDay={isFirstDay}
      isLastDay={isLastDay}
      pagination= {{
        paginationModel: { pageSize: 15, page: 0 },
      }}
    />
  );
}

export default function CustomDay({handler, disable}) {
  const yesterday = dayjs().subtract(1, 'day');
  const [, setError] = useState(null)
  const [value, setValue] = React.useState(yesterday);

  const weekly = (newValue) => {
    setValue(newValue)
    handler(newValue)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        showDaysOutsideCurrentMonth
        fixedWeekNumber={6}
        value={!disable ? value : yesterday}
        onChange={(newValue) => weekly(newValue)}
        slots={{ day: Day }}
        slotProps={{
          day: {
            selectedDay: value,
          },
          textField: {
            helperText: 'Select a date between May 01, 2015 and yesterday',
          }
        }}
        disableFuture
        maxDate={yesterday}
        minDate={dayjs('2015-05-01')}
        onError={(newError) => setError(newError)}
        id='week-calendar'
        disabled={disable}
      />
    </LocalizationProvider>
  );
}