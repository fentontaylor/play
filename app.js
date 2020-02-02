var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];

var indexRouter = require('./routes/index');
var favoritesRouter = require('./routes/api/v1/favorites');
var playlistsRouter = require('./routes/api/v1/playlists');
var playlistFavoritesRouter = require('./routes/api/v1/playlistFavorites');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/v1/favorites', favoritesRouter);
app.use('/api/v1/playlists', playlistsRouter);
app.use('/api/v1/playlists/:playlistId/favorites', playlistFavoritesRouter);

const graphqlHTTP = require('express-graphql');
const { schema, root } = require('./lib/schema');

app.use('/api/v2/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))

module.exports = app;
