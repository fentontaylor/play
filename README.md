# Play

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

#### Base url for all requests:

```
https://looney-tunes.herokuapp.com
```

### Endpoints:

#### Favorites
- [POST /api/v1/favorites](#post_favorites)
- [GET /api/v1/favorites](#get_favorites)
- [GET /api/v1/favorites/:id](#get_favorite)
- [DELETE /api/v1/favorites/:id](#delete_favorites)

#### Playlists
- [POST /api/v1/playlists](#post_playlists)
- [GET /api/v1/playlists](#get_playlists)
- [PUT /api/v1/playlists/:id](#put_playlists)
- [DELETE /api/v1/playlists/:id](#delete_playlists)

### Create Favorite Request <a name="post_favorites"></a>

```
POST /api/v1/favorites
```
POST request must have a JSON body with the required attributes `title`, `artistName`. `rating` and `genre` attributes are fetched from [musixmatch API](https://developer.musixmatch.com/). If `genre` is missing, it will default to 'Unknown'.

#### Example

```
POST https://looney-tunes.herokuapp.com/api/v1/favorites

body:
{
  "title": "We Will Rock You",
  "artistName": "Queen"
}
```

#### Success Response

```
Status: 201

{
  "id": 5,
  "title": "We Will Rock You",
  "artistName": "Queen",
  "genre": "Arena Rock",
  "rating": 78
}
```

#### Error Responses
If the JSON body is missing any of the required attributes, a response like the following will be sent:

```
Status: 400

{
  "error": "Missing required attribute <attribute name>"
}
```

### Get Favorites Request <a name="get_favorites"></a>

```
GET /api/v1/favorites
```

#### Example

```
GET https://looney-tunes.herokuapp.com/api/v1/favorites
```

#### Success Response

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

#### Error Responses
If there are no favorites in the database, a response like the following will be sent:

```
Status: 404

{
  "error": "Not found."
}
```

### Get Favorite Request <a name="get_favorite"></a>

```
GET /api/v1/favorites/:id
```

GET request will have the id passed in the URL like in the example below.

#### Example

```
GET https://looney-tunes.herokuapp.com/api/v1/favorites/3

```

#### Success Response

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

#### Error Responses
If the id does not exist in the database, a response like the following will be sent:

```
Status: 404

{
  "error": "Record not found."
}
```

### Delete Favorite Request <a name="delete_favorites"></a>

```
DELETE /api/v1/favorites/3
```

#### Example

```
DELETE https://looney-tunes.herokuapp.com/api/v1/favorites/3

```
#### Success Response

```
Status: 204
```

#### Error Responses
If the id does not exist in the database a response like the following will be sent:

```
Status: 404

{
  "error": "Record not found."
}
```

## Playlist Endpoints

### Create Playlist Request <a name="post_playlists"></a>

```
POST /api/v1/playlists
```

Send a post request with a JSON body containing the attribute `title`. If JSON body is missing, or `title` attribute is missing, the response status will be 400.

### Example

```
POST https://looney-tunes.herokuapp.com/api/v1/playlists
```

#### Success Response

```
Status: 200

{
  "id": 2,
  "title": "hype music",
  "created_at": "2019-12-06T21:05:48.167Z",
  "updated_at": "2019-12-06T21:05:48.167Z"
}
```

### Error Response

```
Status: 400

{
  "error": "Missing required attribute <title>"
}
```

### Get Playlists Request <a name="get_playlists"></a>

```
GET /api/v1/playlists
```

#### Example
```
GET https://looney-tunes.herokuapp.com/api/v1/playlists

```
#### Success Response
```
[
    {
        "id": 1,
        "title": "Focus On the Task",
        "created_at": "2019-12-06T06:20:18.476Z",
        "updated_at": "2019-12-06T06:20:18.476Z"
    },
    {
        "id": 2,
        "title": "Wake Up Music",
        "created_at": "2019-12-06T06:44:30.928Z",
        "updated_at": "2019-12-06T06:44:30.928Z"
    },
    {
        "id": 3,
        "title": "Solo In Mexico",
        "created_at": "2019-12-06T06:45:39.691Z",
        "updated_at": "2019-12-06T06:45:39.691Z"
    }
]
```

### PUT playlists request <a name="put_playlists"></a>

```
PUT `/api/v1/playlists/:id`
```

Request must have a JSON body with an attribute of `title`. Response will be status 400 if missing.

#### Example

```
PUT https://looney-tunes.herokuapp.com/api/v1/playlists/2

{
  "title": "Looney Mix"
}

```

#### Success response
Returns the updated playlist object with the specific :id you've passed in.

```
Status: 200

{
  "id": 2,
  "title": "Looney Mix",
  "createdAt": 2019-11-26T16:03:43+00:00,
  "updatedAt": 2019-11-26T16:03:43+00:00
}
```

#### Error Responses
If there are no playlists in the database, a response like the following will be sent:

```
Status: 404

{
  "error": "Not found."
}
```

#### Error response 
Returns a 404 if the playlist is not found.

```
Status: 404

{ 
  "error": "Record not found"
}
```

Returns 400 if title is not present in JSON body

```
Status: 400

{
  "error": "Missing required attribute <title>"
}
```

### Delete Playlist Request <a name="delete_playlist"></a>

```
DELETE /api/v1/playlists/:id
```

Deletes a playlist with the given id in the request paramaters. If successful, response status is 204. If the record is not found, response status is 404.

#### Example

```
DELETE https://looney-tunes.herokuapp.com/api/v1/playlists/2
```

#### Success Response

```
Status: 204
```

#### Error Response
```
Status: 404
{
  "error": "Record not found"
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
