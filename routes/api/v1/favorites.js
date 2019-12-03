var express = require('express');
var router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);
const Favorite = require("../../../models/favorite");


router.get('/', (request, response) => {
  
});

router.post('/', (request, response) => {
  var body = request.body;

  for (let requiredParam of ['title', 'artistName', 'rating']) {
    if (!body[requiredParam]) {
      return response
        .status(400)
        .send({ error: `Missing required attribute <${requiredParam}>` });
    }
  }

  var fav = new Favorite(body);

  database('favorites')
    .insert(fav, 'id')
    .returning('id')
    .then(id => response.status(201).send({ id: id[0] }))
    .catch(error => response.status(500).send({ error }))
});

module.exports = router;
