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
const config = require('./config/database');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage').GridFsStorage;
const Grid = require('gridfs-stream');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const homeRouter = require('./routes/home');
// const uploadRouter = require('./routes/upload');

const app = express();

mongoose.connect(config.database, { useNewUrlParser: true , useUnifiedTopology: true});
const conn = mongoose.connection;
// const conn = mongoose.createConnection(config.database, { useNewUrlParser: true , useUnifiedTopology: true});
conn.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(cookieParser());

app.use(methodOverride('_method'));
app.use(logger('dev'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// Init gfs
let gfs, gridfsBucket;

conn.on('open', () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads'
  });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});


const storage = new GridFsStorage({
  db: conn,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});

// Set multer storage engine to the newly created object
const upload = multer({ storage });

app.get('/upload', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      res.render('upload_form', { files: false });
    } else {
      files.map(file => {
        if (
          file.contentType === 'image/jpeg' ||
          file.contentType === 'image/png'
        ) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
      res.render('upload_form', { files: files });
    }
  });
});

// app.get('/upload', ({ params: { id } }, res) => {

//   const _id = new mongoose.Types.ObjectId(id);
  
//   gridfsBucket.find({ _id }).toArray((err, files) => {
//     if (!files || files.length === 0) {
//       res.render('upload_form', { files: false });
//     } else {
//       files.map(file => {
//         if (
//           file.contentType === 'image/jpeg' ||
//           file.contentType === 'image/png'
//         ) {
//           file.isImage = true;
//         } else {
//           file.isImage = false;
//         }
//       });
//       res.render('upload_form', { files: files });
//     }
//   });
// });

app.post('/upload', upload.single('file'), (req, res) => {
  // res.json({ file: req.file });
    res.redirect('/upload');
});

app.get('/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }

    // Files exist
    return res.json(files);
  });
});

app.get('/files/:id', ({ params: { id } }, res) => {

  const _id = new mongoose.Types.ObjectId(id);
  
  gridfsBucket.find({ _id }).toArray((err, files) => {
    if (!files || files.length === 0)
      return res.status(400).send('no files exist');
    // File exists
    return res.json(files);
  });
});

app.get('/image/:id', ({ params: { id } }, res) => {
  if (!id || id === 'undefined') return res.status(400).send('no image id');

    const _id = new mongoose.Types.ObjectId(id);

  gridfsBucket.find({ _id }).toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }

    gridfsBucket.openDownloadStream(_id).pipe(res);
  });
});

app.get('/download', function(req, res){
  const file = `${__dirname}/upload-folder/Resume.pdf`;
  res.download(file); // Set disposition and send it.
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

// // Express validator middleware
// app.use(expressValidator({
//   errorFormatter: function (param, msg, value) {
//     const namespace = param.split('.')
//       , root = namespace.shift()
//       , formParam = root;

//     while (namespace.length) {
//       formParam += '[' + namespace.shift() + ']';
//     }
//     return {
//       param: formParam,
//       msg: msg,
//       value: value
//     };
//   }
// }));

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
// app.use('/submit', uploadRouter);

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
