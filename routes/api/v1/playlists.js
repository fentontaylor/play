var express = require('express');
var router = express.Router();
const helpers = require('../../../utils/playlistsHelpers');
const findPlaylist = helpers.findPlaylist;
const deletePlaylist = helpers.deletePlaylist;

router.delete('/:id', (request, response) => {
  let id = request.params.id;

  findPlaylist(id)
  .then(result => {
    if (result) {
      deletePlaylist(request.params.id)
      .then(() => response.status(204).send())
      .catch(error => response.status(500).send({ error }));
    } else {
      response.status(404).send({ error: 'Record not found' })
    }
  })
  .catch(error => response.status(500).send({ error }));
})

module.exports = router;
