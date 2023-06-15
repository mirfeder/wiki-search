from fastapi import FastAPI, Body
from pydantic import BaseModel
from typing import List
from collections import defaultdict
import requests

app = FastAPI()

class Days(BaseModel):
    dates: List[str]


baseUrl = 'https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/'

@app.get("/monthly/{year}/{month}")
def getMonthly(year, month):
    fullUrl = f'{baseUrl}{year}/{month}/all-days'
    print(fullUrl)
    headers = {'User-Agent': 'mirfeder@gmail.com'}
    pageViews = requests.get(fullUrl, headers=headers)
    pageViews = pageViews.json()
    return {'pageViews': pageViews['items'][0]['articles']}

@app.post("/weekly")
async def getWeekly(body: Days):
    print(body.dates)
    responses = []
    mem = defaultdict(int)
    for day in body.dates:
        print(day)
        url = baseUrl + day
        print(url)
        headers = {'User-Agent': 'mirfeder@gmail.com'}
        pageViews = requests.get(url, headers=headers)
        pageViews = pageViews.json()
        responses.extend(pageViews['items'][0]['articles'])
    for response in responses:
        mem[response['article']] += response['views']
    result = sorted(mem.items(), key=lambda x:x[1], reverse=True)
    return {'pageViews': result}





