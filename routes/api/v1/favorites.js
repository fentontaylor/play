var express = require('express');
var router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);


router.get('/', (request, response) => {
  
});

router.post('/', (request, response) => {
  console.log(request.body);
  response.status(201).send();
});

module.exports = router;
