import dayjs from 'dayjs';
const yesterday = dayjs().subtract(1, 'day');
import Path from 'path'

/**
 * determines the start and end dates to use in API request
 * If current month, ensures end date is no later than yesterday
 * @param {dayjs} selection - selected date
 * @param {string} type - month or week
 * @returns start and end dates to use in search
 */
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
    }
  }
  return [start, end]
}
/**
 * format date per article search format
 * @param {dayjs} selection 
 * @returns date formatted for API request
 */
const formattedDate = (selection) => {
  return dayjs(selection).toISOString().slice(0, 10).replace(/-/g, '');
}
/**
 * Finds weekly or monthly page view stats about a selected article
 * @param {string} article = article to search
 * @param {string} slot = month or week
 * @param {dayjs} weekValue = selection if weekly
 * @param {dayjs} monthValue = selection if monthly
 * @returns monthly or weekly views for the article
 */
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
    let response = await fetch(fullUrl)
    response = await response.json()
    const arr = response?.['pageViews']
    if (response != undefined) {
      const viewData = slot === 'week'
        ? new Array(7).fill(0)
        : new Array(31).fill(0)
      for (let i = 0; i < arr.length; i++) {
        if (slot === 'week') {
          const views = arr?.[i]?.['views']
          const day = dayjs(arr[i]['timestamp'].slice(0, 8)).day()
          viewData[day] = views
        } else {
          const d = parseInt(arr?.[i]?.['timestamp'].slice(6, 8) - 1)
          viewData[d] = arr?.[i]?.['views']
        }
      }
      return viewData
    }
}
// eslint-disable-next-line no-undef
module.exports = { calcDays, getArticleData }