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
Play is a simple API that allows users to create playlists, create favorites, and add favorites to playlists. To use the production application, jump straight to the [API documentation](#api_docs). Or if you want to tinker with the code, follow the setup instructions below.

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
<details>
  <summary>V1: RESTful API</summary>

### All Requests

#### Base url for all requests:

```
https://looney-tunes.herokuapp.com
```

### Endpoints: <a name="endpoint-list"></a>

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

#### PlaylistFavorites
- [GET /api/v1/playlists/:id/favorites](#get_pf)
- [POST /api/v1/playlists/:p_id/favorites/:f_id](#post_pf)
- [DELETE /api/v1/playlists/:p_id/favorites/:f_id](#delete_pf)

### Create Favorite Request <a name="post_favorites"></a>
[return to endpoint list](#endpoint-list)

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
[return to endpoint list](#endpoint-list)

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
[return to endpoint list](#endpoint-list)

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
[return to endpoint list](#endpoint-list)

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
[return to endpoint list](#endpoint-list)

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

Status: 400

{
  "error": "Playlist already exists with title: 'some title'"
}
```

### Get Playlists Request <a name="get_playlists"></a>
[return to endpoint list](#endpoint-list)

```
GET /api/v1/playlists
```

Returns an array of playlists, including song count, average song rating, and associated favorites.

#### Example
```
GET https://looney-tunes.herokuapp.com/api/v1/playlists

```
#### Success Response
```
Status: 200

[
  {
    "id": 1,
    "title": "Cleaning House",
    "songCount": 2,
    "songAvgRating": 27.5,
    "favorites": [
                    {
                      "id": 1,
                      "title": "We Will Rock You",
                      "artistName": "Queen"
                      "genre": "Rock",
                      "rating": 25
                    },
                    {
                      "id": 4,
                      "title": "Back In Black",
                      "artistName": "AC/DC"
                      "genre": "Rock",
                      "rating": 30
                    }
                  ],
    "createdAt": 2019-11-26T16:03:43+00:00,
    "updatedAt": 2019-11-26T16:03:43+00:00
}
  {
    "id": 2,
    "title": "Running Mix",
    "songCount": 0,
    "songAvgRating": 0,
    "favorites": []
    "createdAt": 2019-11-26T16:03:43+00:00,
    "updatedAt": 2019-11-26T16:03:43+00:00
  },
]
```

### PUT playlists request <a name="put_playlists"></a>
[return to endpoint list](#endpoint-list)

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
[return to endpoint list](#endpoint-list)

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

### Get Playlist Favorites Request <a name="get_pf"></a>
[return to endpoint list](#endpoint-list)

```
GET /api/v1/playlists/:id/favorites
```

Returns info about playlist with specified ID, including song count, average song rating, and associated favorites.

#### Example

```
GET https://looney-tunes.herokuapp.com/api/v1/playlists/1/favorites
```

#### Success Response

```
Status: 200

{
    "id": 1,
    "title": "Cleaning House",
    "songCount": 2,
    "songAvgRating": 27.5,
    "favorites": [
                    {
                      "id": 1,
                      "title": "We Will Rock You",
                      "artistName": "Queen"
                      "genre": "Rock",
                      "rating": 25
                    },
                    {
                      "id": 4,
                      "title": "Back In Black",
                      "artistName": "AC/DC"
                      "genre": "Rock",
                      "rating": 30
                    }
                  ],
    "createdAt": 2019-11-26T16:03:43+00:00,
    "updatedAt": 2019-11-26T16:03:43+00:00
}
```

#### Error Response
```
Status: 404
{
  "error": "Record not found"
}
```

### Add Playlist Favorite Request <a name="post_pf"></a>
[return to endpoint list](#endpoint-list)

```
POST /api/v1/playlists/:p_id/favorites/:f_id
```

Create a new playlist_favorite record with playlist_id: `p_id`, favorite_id: `f_id`.

#### Example

```
POST https://looney-tunes.herokuapp.com/api/v1/playlists/1/favorites/2
```

#### Success Response

```
Status: 201

{
  "success": "{song title} has been added to {playlist title}"
}
```

#### Error Responses

```
Status: 409

{
    "error": "Record already exists with playlist_id: 1, favorite_id: 2"
}

Status: 400

{
    "error": "Could not create record with playlist_id: 1, favorite_id: 412312"
}
```

### Delete Playlist Favorite Request <a name="delete_pf"></a>
[return to endpoint list](#endpoint-list)

```
DELETE /api/v1/playlists/:p_id/favorites/:f_id
```

#### Example
```
DELETE https://looney-tunes.herokuapp.com/api/v1/playlists/:p_id/favorites/:f_id
```

#### Success Response

```
Status: 204
```

#### Error Response

```
Status: 404

{
    "error": "Record not found."
}
```
</details>

<details>
  <summary>V2: GraphQL API</summary>
  
  ### Base URL
  ```
  https://looney-tunes.herokuapp.com/api/v2/graphql
  ```
  Navigate to the base url to interact with the API using [GraphiQL](https://looney-tunes.herokuapp.com/api/v2/graphql). Or, 
  send requests with the the following queries and mutations as query params: `?query=<query.`
  
  ### Queries
  ### query { favorites }
  Returns an index of all favorites.
  
  #### Example
  ```
  query {
    favorites {
      id
      title
      artist_name
      rating
      genre
    }
  }
  ```
  
  #### Success Response
  ```json
  {
    "data": {
      "favorites": [
        {
          "id": 2,
          "title": "Rollout",
          "artist_name": "Ludacris",
          "rating": 23,
          "genre": "Unknown"
        },
        {
          "id": 5,
          "title": "Never Gonna Give You Up",
          "artist_name": "Rick Astley",
          "rating": 62,
          "genre": "Adult Contemporary"
        }, ...
      ]
    }
  }
  ```
  
  ### query { favorite(id: ID) }
  Returns a single favorite by ID. ID can be an integer or a string of an integer.
  
  #### Example
  ```
  query {
    favorite(id: 5) {
      id
      title
      artist_name
      rating
      genre
    }
  }
  ```
  #### Success Response
  ```json
  {
    "data": {
      "favorite": {
        "id": 5,
        "title": "Never Gonna Give You Up",
        "artist_name": "Rick Astley",
        "rating": 62,
        "genre": "Adult Contemporary"
      }
    }
  }
  ```
  
  #### Error Responses
  ```json
  ### Record not found
  
  {
    "errors": [
      {
        "message": "Record not found with provided ID.",
        "statusCode": 404
      }
    ],
    "data": {
      "favorite": null
    }
  }
  
  ### Missing required ID
  
  {
    "errors": [
      {
        "message": "Field \"favorite\" argument \"id\" of type \"ID!\" is required, but it was not provided.",
        "locations": [
          {
            "line": 2,
            "column": 3
          }
        ]
      }
    ]
  }
  ```
  
  ### Mutations
  ### mutation { createFavorite(title: String, artistName: String) }
  This mutation queries the musixmatch API to get the `rating` and `genre` of the song. `title` and `artistName` are required arguments.
  
  #### Example
  ```
  mutation {
    createFavorite(title: "One", artistName: "Metallica") {
      id
      title
      artist_name
      rating
      genre
    }
  }
  ```
  
  #### Success Response
  ```json
  {
    "data": {
      "createFavorite": {
        "id": 14,
        "title": "One",
        "artist_name": "Metallica",
        "rating": 51,
        "genre": "Unknown"
      }
    }
  }
  ```
  
  #### Error Responses
  ```json
  ### Missing argument
  
  {
    "errors": [
      {
        "message": "Field \"createFavorite\" argument \"artistName\" of type \"String!\" is required, but it was not provided.",
        "locations": [
          {
            "line": 2,
            "column": 3
          }
        ]
      }
    ]
  }
  
  ### Empty response from musixmatch
  
  {
    "errors": [
      {
        "message": "Could not fetch song data with given 'title' and 'artistName'.",
        "statusCode": 400
      }
    ],
    "data": {
      "createFavorite": null
    }
  }
  ```
  
  ### mutation { deleteFavorite(id: ID) }
  This mutation deletes the favorite with the given ID. `id` is a required argument.
  
  #### Example
  ```
  mutation {
    deleteFavorite(id: 9)
  }
  ```
  
  #### Success Response
  ```json
  {
    "data": {
      "deleteFavorite": "Deleted favorite with id: 9"
    }
  }
  ```
  
  #### Error Responses
  ```json
  ### Missing id argument
  
  {
    "errors": [
      {
        "message": "Field \"deleteFavorite\" argument \"id\" of type \"ID!\" is required, but it was not provided.",
        "locations": [
          {
            "line": 2,
            "column": 3
          }
        ]
      }
    ]
  }
  
  ### Record not found
  
  {
    "errors": [
      {
        "message": "Record not found with provided ID.",
        "statusCode": 404
      }
    ],
    "data": null
  }
  ```
  
 </details>

## Schema Design <a name="schema"></a>
![image](https://user-images.githubusercontent.com/18686466/70660943-7672fd00-1c20-11ea-8d85-50ec4e204752.png)

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
