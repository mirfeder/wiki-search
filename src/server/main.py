from fastapi import FastAPI, Body
from pydantic import BaseModel
from typing import List
from collections import defaultdict
import requests

app = FastAPI()

class Days(BaseModel):
    dates: List[str]

baseUrlStart = 'https://wikimedia.org/api/rest_v1/metrics/pageviews/'
baseUrlEnd = '/en.wikipedia/all-access/'
topViewsUrl = baseUrlStart + 'top' + baseUrlEnd
articleViewsUrl =  baseUrlStart + 'per-article' + baseUrlEnd

@app.get("/monthly/{year}/{month}")
def getMonthly(year, month):
    fullUrl = f'{topViewsUrl}{year}/{month}/all-days'
    headers = {'User-Agent': 'mirfeder@gmail.com'}
    pageViews = requests.get(fullUrl, headers=headers)
    pageViews = pageViews.json()
    return {'pageViews': pageViews['items'][0]['articles']}

@app.get("/article/{article}/{startDate}/{endDate}")
def getArticle(article, startDate, endDate):
    fullUrl = f'{articleViewsUrl}' + '/'.join(['all-agents', article, 'daily', startDate, endDate])
    print(fullUrl)
    headers = {'User-Agent': 'mirfeder@gmail.com'}
    pageViews = requests.get(fullUrl, headers=headers)
    if pageViews.status_code != 200:
        print(pageViews.json())
    else:
        pageViews = pageViews.json()
        return {'pageViews': pageViews['items']}


@app.post("/weekly")
async def getWeekly(body: Days):
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





