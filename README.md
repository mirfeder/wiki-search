# wiki-search
Search wikipedia for most visited pages by week or month

# Installation
- clone the project
- cd to project root directory
## Client Environment Setup
- `yarn add --dev parcel` or
- `npm install --save-dev parcel`

## Server Environment Setup
- Note: project was built using python 3.8.16
### - create and activate the virtual environment
- `cd src/server` 
- `python -m venv venv`
- `source venv/bin/activate`
### - install dependencies
- `pip install -r requirements.txt`
## Run the Server:
- `uvicorn main:app --reload`
- Swagger docs available at http://localhost:8000/docs
- OpenAPI docs available at http://localhost:8000/reDoc
## Run the Client:
- in a different terminal session, from the project root directory,run:
- `yarn parcel src/client/index.html`
- Open browser to http://localhost:1234

## Using the application
- Select either Month or Week button at the top of the left grid
- Select desired month or week to search (future dates and dates earlier than May 1, 2015 cannot be searched)
- Results are returned in the grid on the right
- Select a row from the results grid to see page view metrics for that page over the selected month or week