require('dotenv').config()
var express = require('express');
var router = express.Router();
const Favorite = require("../../../models/favorite");
const fetchSongInfo = require("../../../services/musixService");
const favoritesHelpers = require("../../../helpers/favoritesHelpers");
const favoriteSongs = favoritesHelpers.favoriteSongs;
const favoriteSong = favoritesHelpers.favoriteSong;
const seekAndDestroy = favoritesHelpers.seekAndDestroy;
const createFavorite = favoritesHelpers.createFavorite;

router.get('/', (request, response) => {
  favoriteSongs()
  .then(favorites => {
    if (favorites.length) {
      response.status(200).send(favorites)
    } else {
      response.status(404).json({
        error: 'Not found.'
      })
    }
  })
  .catch(error => response.status(500).send({ error }))
});

router.get('/:id', (request, response) => {
  favoriteSong(request.params.id)
  .then(favorite => {
    if (favorite.length) {
      response.status(200).send(favorite)
    } else {
      response.status(404).json({
        error: 'Record not found.'
      })
    }
  })
  .catch(error => response.status(500).send({ error }))
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

  fetchSongInfo(title, artist)
  .then(res => {
    var fav = new Favorite(res);

    createFavorite(fav)
    .then(attr => {
      response.status(201).send(attr[0])
    })
    .catch(error => response.status(500).send({ error }))
  })
  .catch(error => response.status(500).send({ error }))
});

router.delete('/:id', (request, response) => {
  favoriteSong(request.params.id)
  .then(favorite => {
    if (favorite.length) {
      let targetId = request.params.id
      seekAndDestroy(targetId)
      .then(() => response.status(204).send())
      .catch(error => response.status(500).send({ error }))
    } else {
      response.status(404).json({
        error: 'Record not found.'
      })
    }
  })
  .catch(error => response.status(500).send({ error }))
});

module.exports = router;
