var express = require('express');
var router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);


router.get('/', (request, response) => {
  
});

router.post('/', (request, response) => {
  var body = request.body;
  body.artist_name = body.artistName;
  delete body.id;
  delete body.artistName;

  database('favorites')
    .insert(body, 'id')
    .returning('id')
    .then(id => {
      response.status(201).send({id: id[0]});
    })
});

module.exports = router;
