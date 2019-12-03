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
      response.status(200).send(favorites)
    })
});

router.post('/', (request, response) => {
  var body = request.body;
  const title = body.title;
  const artist = body.artistName;

  for (let requiredParam of ['title', 'artistName']) {
    if (!body[requiredParam]) {
      return response
      .status(400)
      .send({ error: `Missing required attribute <${requiredParam}>` });
    }
  }

  // var rating = parseInt(request.body.rating)

  // if (!(rating >= 1 && rating <= 100)) {
  //   return response
  //     .status(400)
  //     .send({ error: "Rating must be between 1-100" })
  // }

  fetchSongInfo(title, artist)
  .then(res => {
    console.log(res);
    var fav = new Favorite(res);

    database('favorites')
      .insert(fav, 'id')
      .returning('id')
      .then(id => response.status(201).send({ id: id[0] }))
      .catch(error => response.status(500).send({ error }))
  })
});

async function favoriteSongs() {
  try{
    return await database('favorites')
  }catch(e){
    return e;
  }
}

module.exports = router;
