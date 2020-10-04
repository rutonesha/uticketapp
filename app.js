require('dotenv').config()

var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
var path = require('path');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const passport = require('passport');
var expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileUpload');


var indexRouter = require('./routes/index');
var uticketsRouter = require('./routes/utickets');


var app = express();
app.use(express.urlencoded({extended:false}));




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('view engine', 'ejs');
var hour = 3600000



app.use(session({
  secret: 'thatsecretthinggoeshere',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: hour, expires: new Date(Date.now() + hour)}
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'node_modules')));
// --------------------------------------------------------------------
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
// app.use(fileUpload());


app.use(function(req, res, next){
    res.locals.message = req.flash('message');
    next();
});
// ------------------------------------------------------------------------

app.use('/', indexRouter);
app.use('/utickets', uticketsRouter);
app.use('/utickets/scripts', express.static(__dirname + '/node_modules/'));

app.use('/utickets/events/artworks', express.static(__dirname + '/events/artworks'));

require('./config/passport')(passport);
// ================================================


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
  console.log(err.status)
  console.log(err.message)
  res.render('error', { title: 'Page not found', layout: 'error' });
  
});

module.exports = app;
