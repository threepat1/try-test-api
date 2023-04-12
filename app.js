var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
const animalShelterRouter = require('./router/animalshelter');
const authRouter = require('./router/auth');

var app = express();


// database setup
var mongoose = require('mongoose');
var DB = require('./config/db');

//show mongoose the Atlas URI in db,
mongoose.connect(DB.URI, { useNewUrlParser: true, useUnifiedTopology: true });

//messages to show on connection or error
let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection Error:'));
mongoDB.once('open', () => {
  console.log('Connected to MongoDB...');
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//authentication
app.use(cors());

// allow to access the request body using req.body in routes.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', indexRouter);
//authentication do not move
app.use('/auth', authRouter);

//Threepat Kiatkamol - Create pets.js file to control the request
app.use('/animalshelter', animalShelterRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
