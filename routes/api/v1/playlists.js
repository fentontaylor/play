var express = require('express');
var router = express.Router();
const helpers = require('../../../utils/playlistsHelpers');
const findPlaylist = helpers.findPlaylist;
const deletePlaylist = helpers.deletePlaylist;

router.delete('/:id', (request, response) => {
  deletePlaylist(request.params.id)
  .then(() => response.status(204).send())
  .catch(error => response.status(500).send({ error }));
})

module.exports = router;
