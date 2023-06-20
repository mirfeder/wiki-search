from collections import defaultdict
from typing import List

import requests
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Days(BaseModel):
    """list of days to search

    Args:
        dates (list['yyyy/mm/dd']): a list of dates in formation 'yyyy/mm/dd'
    """
    dates: List[str]

BASE_URL_START = 'https://wikimedia.org/api/rest_v1/metrics/pageviews/'
BASE_URL_END = '/en.wikipedia/all-access/'
TOP_VIEWS_URL = BASE_URL_START + 'top' + BASE_URL_END
ARTICLE_VIEWS_URL =  BASE_URL_START + 'per-article' + BASE_URL_END

@app.get("/monthly/{year}/{month}")
def get_monthly(year, month):
    """receives a year and month to search for most viewed pages during that time period

    Args:
        year (string): year to search
        month (string): month to search

    Returns:
        dict: a dictionary with key = 'pageViews' and value = a list of dicts
        with information about top 1000 most viewed articles for that time period
    """
    fullUrl = f'{TOP_VIEWS_URL}{year}/{month}/all-days'
    headers = {'User-Agent': 'mirfeder@gmail.com'}
    page_views = requests.get(fullUrl, headers=headers)
    if page_views.status_code != 200:
        print(page_views.json())
        return
    page_views = page_views.json()
    responses = page_views.get('items')
    responses = responses[0].get('articles')
    return {'pageViews': responses}


@app.get("/article/{article}/{start_date}/{end_date}")
def getArticle(article, start_date, end_date):
    """retrieves metrics for an article within the dates specified

    Args:
        article (string): name of article to search
        start_date (yyyymmdd): start date of search
        end_date (yyyymmdd): end date of search

    Returns:
       dict: a dictionary with key = 'pageViews' and value = a list of dicts 
       with information about top 1000 most viewed articles for that time period
    """
    fullUrl = f'{ARTICLE_VIEWS_URL}' + '/'.join(
        ['all-agents', article, 'daily', start_date, end_date])
    headers = {'User-Agent': 'mirfeder@gmail.com'}
    page_views = requests.get(fullUrl, headers=headers)
    if page_views.status_code != 200:
        print(page_views.json())
    else:
        page_views = page_views.json()
        return {'pageViews': page_views.get('items')}


@app.post("/weekly")
async def get_weekly(body: Days):
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
        url = TOP_VIEWS_URL + day
        headers = {'User-Agent': 'mirfeder@gmail.com'}
        page_views = requests.get(url, headers=headers)
        if page_views.status_code != 200:
            print(page_views.json())
            return
        page_views = page_views.json()
        responses = page_views.get('items')
        responses = responses[0].get('articles')
        for response in responses:
            mem[response.get('article')] += response.get('views')
    result = sorted(mem.items(), key=lambda x:x[1], reverse=True)
    return {'pageViews': result}





