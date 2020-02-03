var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//////////////
//  API V1  //
//////////////
var indexRouter = require('./routes/index');
var favoritesRouter = require('./routes/api/v1/favorites');
var playlistsRouter = require('./routes/api/v1/playlists');
var playlistFavoritesRouter = require('./routes/api/v1/playlistFavorites');

app.use('/', indexRouter);
app.use('/api/v1/favorites', favoritesRouter);
app.use('/api/v1/playlists', playlistsRouter);
app.use('/api/v1/playlists/:playlistId/favorites', playlistFavoritesRouter);


//////////////
//  API V2  //
//////////////
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schemaBuilder');
const root = require('./schema/resolvers')
const FormatError = require('easygraphql-format-error');

const formatError = new FormatError([
  {
    name: 'FAVORITE_NOT_FOUND',
    message: 'Record not found with provided ID.',
    statusCode: 404
  }
])
const errorName = formatError.errorName

app.use('/api/v2/graphql', (req, res) => {
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
    context: { errorName },
    customFormatErrorFn: (err) => {
      return formatError.getError(err)
    }
  })(req, res)
})

module.exports = app;
