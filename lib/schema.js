const { buildSchema } = require('graphql')
const { 
  favoriteSongs,
  favoriteSong
 } = require('../utils/favoritesHelpers')

var schema = buildSchema(`
  type Favorite {
    id: Int
    title: String!
    artist_name: String!
    genre: String
    rating: Int
  }

  type Query {
    favorites: [Favorite]
    favorite(id: ID!): Favorite
  }
`);

var root = {
  favorites: () => {
    return favoriteSongs();
  },
  favorite: (args) => {
    return favoriteSong(args.id)
  }
};

module.exports = {
  schema: schema,
  root: root
}
