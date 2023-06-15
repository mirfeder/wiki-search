import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

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
  }
};

// ==============================|| INCOME AREA CHART ||============================== //

const PageViewChart = ({ slot, data, article }) => {
  const theme = useTheme();

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary.main, theme.palette.primary.light],
      xaxis: {
        categories: slot === 'week' 
        ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] 
        : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
        labels: {
          style: {
            colors: [
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary
            ]
          }
        },
        axisBorder: {
          show: true,
          color: line
        },
        tickAmount: 7
      },
      yaxis: {
        labels: {
          style: {
            colors: [secondary]
          }
        }
      },
      grid: {
        borderColor: line
      },
      tooltip: {
        theme: 'light'
      },
      title: {
        text: 'Page Views by ' + slot + ": " + article
      }
    }));
  }, [primary, secondary, line, theme, slot, article]);

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
  slot: PropTypes.string
};

export default PageViewChart;
