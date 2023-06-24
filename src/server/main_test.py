import pytest
import requests
from main import get_monthly

monthly_data = {
    "items": [
        {
            "project": "en.wikipedia",
            "access": "all-access",
            "year": "2023",
            "month": "05",
            "day": "all-days",
            "articles": [
                {"article": "Main_Page", "views": 146047748, "rank": 1},
                {"article": "Special:Search", "views": 40426274, "rank": 2},
                {"article": "Indian_Premier_League", "views": 20824192, "rank": 3},
                {"article": "2023_Indian_Premier_League", "views": 12968266, "rank": 4},
            ],
        }
    ]
}

monthly_response = {
    'pageViews': [
        {"article": "Main_Page", "views": 146047748, "rank": 1},
        {"article": "Special:Search", "views": 40426274, "rank": 2},
        {"article": "Indian_Premier_League", "views": 20824192, "rank": 3},
        {"article": "2023_Indian_Premier_League", "views": 12968266, "rank": 4}
    ]}

class MockResponse:
    def __init__(self, json_data, status_code) -> None:
        self.json_data = json_data
        self.status_code = status_code
      
    def json(self):
        return self.json_data
        
def test_api_call_get(monkeypatch):
    
  def mock_requests_get(*args, **kwargs):
      return MockResponse(monthly_data, 200)
  
  monkeypatch.setattr(requests, 'get', mock_requests_get)

  result = get_monthly('2023', '05')
  assert result == monthly_response


