require('dotenv').config()
var express = require('express');
var router = express.Router();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);
const Favorite = require("../../../models/favorite");


router.get('/', (request, response) => {
  favoriteSongs()
    .then(favorites => {
      if (favorites.length){
      response.status(200).send(favorites)
    } else {
      response.status(404).json({
        error: 'Record not found.'
      })
    }
    })
});

router.get('/:id', (request, response) => {
  favoriteSong(request.params.id)
    .then(favorite => {
      if (favorite.length){
      response.status(200).send(favorite)
    } else {
      response.status(404).json({
        error: 'Not found.'
      })
    }
  })
});

router.post('/', (request, response) => {
  var body = request.body;

  for (let requiredParam of ['title', 'artistName', 'rating']) {
    if (!body[requiredParam]) {
      return response
      .status(400)
      .send({ error: `Missing required attribute <${requiredParam}>` });
    }
  }

  var rating = parseInt(request.body.rating)

  if (!(rating >= 1 && rating <= 100)) {
    return response
      .status(400)
      .send({ error: "Rating must be between 1-100" })
  }

  var fave = new Favorite(body);

  database('favorites')
    .insert(fave, 'id')
    .returning('id')
    .then(id => response.status(201).send({ id: id[0] }))
    .catch(error => response.status(500).send({ error }))
});

async function favoriteSongs() {
  try{
    return await database('favorites')
    .column(['id', 'title', 'artist_name', 'genre', 'rating'])
  }catch(e){
    return e;
  }
}

async function favoriteSong(songId) {
  try{
    return await database('favorites').where({id: songId})
    .column(['id', 'title', 'artist_name', 'genre', 'rating'])
  }catch(e){
    return e;
  }
}

module.exports = router;
