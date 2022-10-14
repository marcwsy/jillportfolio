const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');
const favicon = require('serve-favicon');


const { connectDb } = require('./config/db');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const homeRouter = require('./routes/home');
// const uploadRouter = require('./routes/upload');
const modelingRouter = require('./routes/modeling');
const animationRouter = require('./routes/animation');
const illustrationRouter = require('./routes/illustration');

const app = express();
connectDb();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(cookieParser());

// tab icon
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));
app.use(methodOverride('_method'));
app.use(logger('dev'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// download jills resume
app.get('/download', function(req, res){
  const file = `${__dirname}/upload-folder/Jillian_Sy_Resume_2022.docx`;
  res.download(file);
});
  
// Express session middleware
app.use(session({
  secret: 'random stuff',
  resave: true,
  saveUninitialized: true,
}));

// Express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/home', homeRouter);
// app.use('/file', uploadRouter);
app.use('/modeling', modelingRouter);
app.use('/animation', animationRouter);
app.use('/illustration', illustrationRouter);

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
