var express = require('express');
var router = express.Router({ mergeParams: true });
const findFavorite = require("../../../utils/favoritesHelpers").favoriteSong;
const findPlaylist = require("../../../utils/playlistsHelpers").findPlaylist;

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);

router.post('/:favId', async (request, response) => {
  const playlistId = request.params.playlistId;
  const favId = request.params.favId;
  // console.log(`playlist: ${playlistId}, favorite: ${favId}`)
  const favorite = await findFavorite(favId);
  const playlist = await findPlaylist(playlistId);

  database('playlist_favorites')
    .insert({ playlist_id: playlistId, favorite_id: favId }, 'id')
    .then(() => {
      response.status(201).send({ success: `${favorite[0].title} has been added to ${playlist.title}!` })
    })
})

module.exports = router;