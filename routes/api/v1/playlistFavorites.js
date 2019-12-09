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

  createPlaylistFavorite(playlistId, favId)
  .then(() => {
    response.status(201).send({ success: `${favorite.title} has been added to ${playlist.title}!` })
  })
})

module.exports = router;