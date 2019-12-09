var express = require('express');
var router = express.Router({ mergeParams: true });
const findFavorite = require("../../../utils/favoritesHelpers").favoriteSong;
const findPlaylist = require("../../../utils/playlistsHelpers").findPlaylist;
const helpers = require("../../../utils/playlistFavoritesHelpers");
const createPlaylistFavorite = helpers.createPlaylistFavorite;

router.post('/:favId', async (request, response) => {
  const playlistId = request.params.playlistId;
  const favId = request.params.favId;

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
  findPlaylist(request.params.playlistId)
  .then(info => {
    if (info) {
      findFavorite(request.params.favId)
      .then(data => {
        if (data) {
          let targetId = request.params.favId
          seekAndDestroy(targetId)
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


async function seekAndDestroy(targetId) {
  try {
    return await database('playlist_favorites').where({ favorite_id: targetId }).del()
  } catch (e) {
    return e;
  }
}
module.exports = router;
