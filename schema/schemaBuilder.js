const { buildSchema } = require('graphql')
const fs = require('fs')
const path = require('path')

const schemaCode = fs.readFileSync(path.join(__dirname, 'schema', 'schema.gql'), 'utf8')
const schema = buildSchema(schemaCode)

module.exports = schema;
