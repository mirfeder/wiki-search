/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// third-party
import ReactApexChart from 'react-apexcharts';

// chart options
const areaChartOptions = {
  chart: {
    height: 450,
    type: 'area',
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  grid: {
    strokeDashArray: 0
  },
  title: {
    text: 'Page Views'
  },
  mode: 'light'
};

const PageViewChart = ({ slot, data, article, theme }) => {

  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      xaxis: {
        categories: slot === 'week'
          ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
          : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
        axisBorder: {
          show: true,
          color: line
        },
        tickAmount: 7
      },
      yaxis: {
        labels: {
          show: true,
          style: {
            colors: theme.palette.mode === 'dark' ? ['white'] : ['black'],
          },
          // eslint-disable-next-line no-unused-vars
          formatter: function (val, index) {
            return val.toLocaleString()
          }
        }
      },
      grid: {
        borderColor: line
      },
      tooltip: {
        theme: theme.palette.mode === 'dark' ? 'dark' : 'light'
      },
      title: {
        text: 'Page Views by ' + slot + ": " + article
      },
      mode: theme.palette.mode === 'dark' ? 'dark' : 'light'
    }));
  }, [line, theme, slot, article]);

  const [series, setSeries] = useState([{
    name: 'Page Views',
    data: []
  }
  ]);

  useEffect(() => {
    setSeries([
      {
        name: 'Page Views',
        data: data
      }
    ]);
  }, [data]);

  return <ReactApexChart options={options} series={series} type="area" height={503} />;
};

PageViewChart.propTypes = {
  slot: PropTypes.string,
  data: PropTypes.array,
  article: PropTypes.string
};

export default PageViewChart;
