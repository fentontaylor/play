var express = require('express');
var router = express.Router({ mergeParams: true });
const findFavorite = require("../../../utils/favoritesHelpers").favoriteSong;
const findPlaylist = require("../../../utils/playlistsHelpers").findPlaylist;
const helpers = require("../../../utils/playlistFavoritesHelpers");
const createPlaylistFavorite = helpers.createPlaylistFavorite;
const deletePlaylistFavorite = helpers.deletePlaylistFavorite;
const playlistInfo = helpers.playlistInfo;

router.post('/:favId', async (request, response) => {
  const { playlistId } = request.params;
  const { favId } = request.params;

  const favorite = await findFavorite(favId);
  const playlist = await findPlaylist(playlistId);

  if (favorite && playlist) {
    createPlaylistFavorite(playlistId, favId)
    .then(() => {
      response.status(201).send({ success: `${favorite.title} has been added to ${playlist.title}!` })
    })
    .catch(error => response.status(500).send({ error }))
  } else {
    response.status(400).send({ error: `Could not create record with playlist_id: ${playlistId}, favorite_id: ${favId}`})
  }

})

router.delete('/:favId', async (request, response) => {
  const favId = request.params.favId
  const playlistId = request.params.playlistId
  findPlaylist(playlistId)
  .then(info => {
    if (info) {
      findFavorite(favId)
      .then(data => {
        if (data) {
          deletePlaylistFavorite(playlistId, favId)
          .then(() => response.status(204).send())
        } else {
          response.status(404).json({
            error: 'Record not found.'
          })
        }
      })
      .catch(error => response.status(500).send({ error }))
    } else {
      response.status(404).json({
        error: 'Record not found.'
      })
    }
  })
  .catch(error => response.status(500).send({ error }))
});

router.get('/', (request, response) => {
  const { playlistId } = request.params
  
  findPlaylist(playlistId)
  .then(playlist => {
    if (playlist) {
      playlistInfo(playlistId)
      .then(info => {
        response.status(200).send(info)
      })
      .catch(error => response.status(500).send({ error }))
    } else {
      response.status(404).send({ error: 'Record not found'})
    }
  })
  .catch(error => response.status(500).send({ error }))
})
module.exports = router;
