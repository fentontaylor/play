var express = require('express');
var router = express.Router();

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);

router.post('/', (request, response) => {
  var body = request.body;
  var title = body.title;

  if (!title){
    return response.status(400).send({ error: `Missing required attribute <title>` });
  }

  createPlaylist(title)
  .then(data => {
    response.status(201).send(data[0])
  })
  .catch(error => response.status(500).send({error}))
});

async function createPlaylist(title) {
  try {
    return await database('playlists')
      .insert({title: title}, 'id')
      .returning('*')
  } catch(e) {
    return e;
  }
}

module.exports = router;
