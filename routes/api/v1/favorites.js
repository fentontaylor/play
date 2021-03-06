require('dotenv').config()
var express = require('express');
var router = express.Router();
const Favorite = require("../../../models/favorite");
const fetchSongInfo = require("../../../utils/musixService");
const favoritesHelpers = require("../../../utils/favoritesHelpers");
const favoriteSongs = favoritesHelpers.favoriteSongs;
const favoriteSong = favoritesHelpers.favoriteSong;
const destroyFavorite = favoritesHelpers.destroyFavorite;
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
    if (favorite) {
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
    if (res.message.body) {
      let fav = new Favorite(res);
      createFavorite(fav)
      .then(favorite => {
        response.status(201).send(favorite)
      })
      .catch(error => response.status(500).send({ error }))
    } else {
      response.status(404).send({ error: `No search results for title: '${title}', artistName: '${artist}'`})
    }
  })
  .catch(error => response.status(500).send({ error }))
});

router.delete('/:id', (request, response) => {
  favoriteSong(request.params.id)
  .then(favorite => {
    if (favorite) {
      let targetId = request.params.id
      destroyFavorite(targetId)
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
