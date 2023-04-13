var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var cors = require('cors');
const bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
const ownerRouter = require("./router/owner");
const animalShelterRouter = require("./router/animalshelter");
const petRouter = require("./router/pets");
const surveyRouter = require("./router/survey");
const passportConfig = require("./config/passport");
const passport = require("passport");

var app = express();

/* image upload limit */
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));

const uploadController = require("./controllers/upload");

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

//access control allow origin
const corsOptions = {
  origin: "https://pet-adoption-comp231.netlify.app",
  //   credentials: true,
};
//authentication
app.use(cors(corsOptions));

// allow to access the request body using req.body in routes.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//initialize passportjs
passportConfig(passport);
app.use(passport.initialize());

//model routes
app.use('/', indexRouter);
app.use("/owner", ownerRouter);
app.use("/animalshelter", animalShelterRouter);
app.use("/pets", petRouter);
app.use("/survey", surveyRouter);


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
