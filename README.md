[![Coverage Status](https://coveralls.io/repos/github/donriddo/messaging-classes-vault/badge.svg?branch=main)](https://coveralls.io/github/donriddo/messaging-classes-vault?branch=main)

# Gamify Learning API (Node.js, Express, TypeScript, Docker, MongoDB, Mongoose)

## Steps to run app

1. Clone the repository

2. Get a working `.env` file. There is a template to follow which is `.env.sample`

### If you want to run inside containers

3. RUN `docker-compose up` - expects you to have docker installed

### If not running inside containers

3. `cd` into the cloned repo and RUN `yarn install` to install all the necessary dependencies

4. Make sure you have MongoDB installed and running 

5. RUN `yarn test` to run the tests.

6. RUN `yarn serve` to launch the app


## How to use the app

### GET ENDPOINTS

[1] You can list assignments by calling `GET /api/assignments`

[2] You can list classes by calling `GET /api/classes`

#### List of utility GET query parameters

##### All list endpoints are paginated and will return a response with the format
```json
{
  "message": "Classes retrieved successfully",
  "data": [
    {
      "_id": "6077010debdb134a9c5fd3a7",
      "title": "Physics",
      "date": "2021-04-14T14:49:50.460Z",
      "assignment": "6077010debdb1369b95fd3a6",
      "createdAt": "2021-04-14T14:49:50.460Z",
      "updatedAt": "2021-04-14T14:49:50.460Z",
      "__v": 0,
      "id": "6077010debdb134a9c5fd3a7"
    }
  ],
  "meta": {
    "limit": 1,
    "offset": 0,
    "total": 15
  }
}
```

- `$offet=number` allows you to skip a number of records e.g `GET /api/classes?$offset=500`

- `$limit=number` allows you specify how many records returned per API call e.g `GET /api/classes?$limit=100`


### POST ENDPOINTS

[1] To create a new class
```json
POST /api/classes

{
	"title": "some-title",
	"date": "some-date"
}
```

### PUT ENDPOINTS

[1] To update an class, do
```json
PUT /api/classes/:classId

{
	"title": "some-new-title",
	"date": "some-new-date"
}
```

### DELETE ENDPOINTS

[1] To delete an class, do
```json
DELETE /api/classes/:classId
```
