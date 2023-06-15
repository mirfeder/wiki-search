from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import requests

app = FastAPI()

class Article(BaseModel):
    article: str
    views: int
    rank: int
class WikiResponseBody(BaseModel):
    project: str
    access: str
    year: str
    month: str
    day: str
    articles: List[Article]
class WikiResponse(BaseModel):
    items: List[WikiResponseBody]

baseUrl = 'https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/'

@app.get("/monthly/{year}/{month}")
def getMonthly(year, month):
    fullUrl = f'{baseUrl}{year}/{month}/all-days'
    print(fullUrl)
    headers = {'User-Agent': 'mirfeder@gmail.com'}
    pageViews = requests.get(fullUrl, headers=headers)
    pageViews:WikiResponse = pageViews.json()
    return {'pageViews': pageViews['items'][0]['articles']}





