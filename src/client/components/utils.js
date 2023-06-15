import dayjs from 'dayjs';
const yesterday = dayjs().subtract(1, 'day');
import Path from 'path'

export const calcDays = (selection, type) => {
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

const formattedDate = (selection) => {
  return dayjs(selection).toISOString().slice(0, 10).replace(/-/g, '');
}

export const getArticleData = async (article, slot, weekValue, monthValue) => {
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
      return viewData
    }
}
module.exports = { calcDays, getArticleData }