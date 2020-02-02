const { buildSchema } = require('graphql')

var schema = buildSchema(``);

var root = {};

module.exports = {
  schema: schema,
  root: root
}
