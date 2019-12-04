# Sweater Weather Express

## Table of Contents
1. [Introduction](#introduction)
1. [Initial Setup](#setup)
1. [How to Run Tests](#tests)
1. [API Documentation](#api_docs)
1. [Schema Design](#schema)
1. [Tech Stack](#stack)
1. [Contributors](#contributors)

## Introduction <a name="introduction"></a>


## Initial Setup <a name="setup"></a>
1) To get started using this app, you'll first need to clone it and install dependencies.
```
git clone git@github.com:fentontaylor/play.git
npm install
```
2) Next, you'll need to set up the database. In the terminal, run:
```
psql
CREATE DATABASE play_dev;
CREATE DATABASE play_test;
\q

knex migrate:latest
knex migrate:latest --env test
knex seed:run
```
3) Finally to start the server using:
```
npm start
```
4) Use your favorite client, like Postman, or send curl requests to the base url:
```
http://localhost:3000/
```

## How to Run Tests <a name="tests"></a>
Run tests with the command:
```
npm test
```

## API Documentation <a name="api_docs"></a>

### All Requests
#### Base url:
```
https://looney-tunes.herokuapp.com
```
#### Endpoints:
- [POST /api/v1/favorites](#post_favorites)
- [GET /api/v1/favorites](#get_favorites)
- [GET /api/v1/favorites/:id](#get_favorite)
- [DELETE /api/v1/favorites](#delete_favorite)


### Add Favorites Request

```
POST /api/v1/favorites
```
POST request must have a JSON body with the required attributes `title`, `artistName`, and `rating`. `genre` attribute is optional, and if not provided, will default to 'Unknown'. The `rating` must be an integer between 1-100.

#### Example
```
POST https://looney-tunes.herokuapp.com/api/v1/favorites

body:
{
  "title": "We Will Rock You",
  "artistName": "Queen",
  "genre": "Rock",
  "rating": 88
}
```
**Success Response**
```
Status: 201

{
  "id": 5
}
```
**Error Responses**
If the JSON body is missing any of the required attributes, a response like the following will be sent:
```
Status: 400

{
  "error": "Missing required attribute <attribute name>"
}
```
If the rating is not an integer between 1-100, a response like the following will be sent:
```
Status: 400

{
  "error": "Rating must be an integer between 1-100"
}
```
### Get Favorites Request

```
GET /api/v1/favorites
```

#### Example
```
GET https://looney-tunes.herokuapp.com/api/v1/favorites

```
**Success Response**
```
[
  {
    id: 1,
    title: "Africa",
    artist_name: "Toto",
    genre: "pop",
    rating: 88
  },
  {
    id: 2,
    title: "Welcome To The Jungle",
    artist_name: "Guns N' Roses",
    genre: "rock",
    rating: 90
  },
  {
    id: 3,
    title: "Never Gonna Give You Up",
    artist_name: "Rick Astley",
    genre: "dance-pop",
    rating: 100
  }
]
```
**Error Responses**
If there are no favorites in the database, a response like the following will be sent:
```
Status: 404

{
  "error": "Not found."
}
```

### Get Favorite Request

```
GET /api/v1/favorites/:id
```
GET request will have the id passed in the URL like in the example below.

#### Example
```
GET https://looney-tunes.herokuapp.com/api/v1/favorites/3

```
**Success Response**
```
[
  {
    id: 3,
    title: "Never Gonna Give You Up",
    artist_name: "Rick Astley",
    genre: "dance-pop",
    rating: 100
  }
]
```
**Error Responses**
If the id does not exist in the database, a response like the following will be sent:
```
Status: 404

{
  "error": "Record not found."
}
```

### Delete Favorite Request

```
DELETE /api/v1/favorites
```
 DELETE request is required to pass an `id` in a JSON body.

#### Example
```
DELETE https://looney-tunes.herokuapp.com/api/v1/favorites
body:
{
  "id": 3
}
```
**Success Response**
```
Status: 204
```
**Error Responses**
If the id does not exist in the database or is passed incorrectly, a response like the following will be sent:
```
Status: 404

{
  "error": "Record not found."
}
```

## Schema Design <a name="schema"></a>


## Tech Stack <a name="stack"></a>
- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [knex](https://www.npmjs.com/package/knex)
- [PostgreSQL](https://www.postgresql.org/)
- [Heroku](heroku.com)

## Contributors <a name="contributors"></a>
###### Nathan Thomas
- [Github](https://github.com/nathangthomas)
- [LinkedIn](https://www.linkedin.com/in/nathangordonthomas/)

###### Fenton Taylor
- [GitHub](https://github.com/fentontaylor)
- [LinkedIn](https://www.linkedin.com/in/fenton-taylor-006057122/)
