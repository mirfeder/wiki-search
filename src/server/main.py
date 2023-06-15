from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:1234",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

baseUrl = 'https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/'

@app.get("/monthly/{year}/{month}/{day}")
def getMonthly(year, month, day):
    fullUrl = f'{baseUrl}{year}/{month}/{day}'
    print(fullUrl)
    headers = {'User-Agent': 'mirfeder@gmail.com'}
    pageViews = requests.get(fullUrl, headers=headers)
    print(pageViews.json())
    return {'pageViews': pageViews.json()}





