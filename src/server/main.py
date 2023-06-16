from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from collections import defaultdict
import requests

app = FastAPI()

class Days(BaseModel):
    """list of days to search

    Args:
        dates (list['yyyy/mm/dd']): a list of dates in formation 'yyyy/mm/dd'
    """
    dates: List[str]

baseUrlStart = 'https://wikimedia.org/api/rest_v1/metrics/pageviews/'
baseUrlEnd = '/en.wikipedia/all-access/'
topViewsUrl = baseUrlStart + 'top' + baseUrlEnd
articleViewsUrl =  baseUrlStart + 'per-article' + baseUrlEnd

@app.get("/monthly/{year}/{month}")
def getMonthly(year, month):
    """receives a year and month to search for most viewed pages during that time period

    Args:
        year (string): year to search
        month (string): month to search

    Returns:
        dict: a dictionary with key = 'pageViews' and value = a list of dicts
        with information about top 1000 most viewed articles for that time period
    """
    fullUrl = f'{topViewsUrl}{year}/{month}/all-days'
    headers = {'User-Agent': 'mirfeder@gmail.com'}
    pageViews = requests.get(fullUrl, headers=headers)
    pageViews = pageViews.json()
    return {'pageViews': pageViews['items'][0]['articles']}


@app.get("/article/{article}/{startDate}/{endDate}")
def getArticle(article, startDate, endDate):
    """retrieves metrics for an article within the dates specified

    Args:
        article (string): name of article to search
        startDate (yyyymmdd): start date of search
        endDate (yyyymmdd): end date of search

    Returns:
       dict: a dictionary with key = 'pageViews' and value = a list of dicts 
       with information about top 1000 most viewed articles for that time period
    """
    fullUrl = f'{articleViewsUrl}' + '/'.join(
        ['all-agents', article, 'daily', startDate, endDate])
    headers = {'User-Agent': 'mirfeder@gmail.com'}
    pageViews = requests.get(fullUrl, headers=headers)
    if pageViews.status_code != 200:
        print(pageViews.json())
    else:
        pageViews = pageViews.json()
        return {'pageViews': pageViews['items']}


@app.post("/weekly")
async def getWeekly(body: Days):
    """takes a list of dates and returns most visited pages for that time period. 
    Dates are assumed to be consecutive but this is not validated. Results will 
    reflect pages with the highest aggregated views over the given dates

    Args:
        body (Days): a list of dates to search in the format "yyyy/mm/dd"

    Returns:
        dict: a dictionary with key = 'pageViews' and value = a list of tuples with 
        article name and view count, reverse-sorted by number of views
    """
    mem = defaultdict(int)
    for day in body.dates:
        url = topViewsUrl + day
        headers = {'User-Agent': 'mirfeder@gmail.com'}
        pageViews = requests.get(url, headers=headers)
        pageViews = pageViews.json()
        responses = pageViews['items'][0]['articles']
        for response in responses:
            mem[response['article']] += response['views']
    result = sorted(mem.items(), key=lambda x:x[1], reverse=True)
    return {'pageViews': result}





