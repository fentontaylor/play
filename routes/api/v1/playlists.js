var express = require('express');
var router = express.Router();
const helpers = require('../../../utils/playlistsHelpers');
const findPlaylist = helpers.findPlaylist;
const createPlaylist = helpers.createPlaylist;
const deletePlaylist = helpers.deletePlaylist;
const allPlaylists = helpers.allPlaylists;
const updatePlaylist = helpers.updatePlaylist;

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);

router.get('/', (request, response) => {
  allPlaylists()
  .then(playlists => {
    if (playlists.length) {
      response.status(200).send(playlists)
    } else {
      response.status(404).json({
        error: 'Not found.'
      })
    }
  })
  .catch(error => response.status(500).send({ error }))
});

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

router.post('/', async (request, response) => {
  var body = request.body;
  var title = body.title;

  if (!title) {
    return response.status(400)
      .send({ error: `Missing required attribute <title>` });
  }

  let result = await database('playlists')
    .where({title: title})

  if (result[0]){
    return response.status(409)
      .send({error: `Playlist already exists with title: '${title}'`})
  }
  
  createPlaylist(title)
  .then(data => {
    response.status(201).send(data)
  })
  .catch(error => response.status(500).send({error}))
});

router.put('/:id', (request, response) => {
  let id = request.params.id;
  let title = request.body.title;

  if (!title) {
    return response.status(400)
      .send({ error: 'Missing required attribute <title>' })
  }

  findPlaylist(id)
  .then(playlist => {
    if (playlist) {
      updatePlaylist(id, title)
      .then(result => {
        response.status(200).send(result);
      })
      .catch(error => response.status(500).send({ error }))
    } else {
      response.status(404).send({ error: 'Record not found' })
    }
  })
})

module.exports = router;
