require("dotenv").config();
const mongoose = require("mongoose");
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const logger = require('morgan');
const cors = require("cors");
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

const app = express();
const port = process.env.PORT || 5000;
// Mongo Db connection
mongoose.connect('mongodb+srv://saman:9939105936@cluster0.f3mwv.mongodb.net/fprtdb?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("DB CONNECTED");
}).catch((err) => {
  console.log(err);
  console.log(`DB NOT CONNECTED :( `);
});

const cloudinary = require('cloudinary').v2;


cloudinary.config({
  cloud_name: 'sa3m6an9',
  api_key: '643338921389265',
  api_secret: 'yUlGjfn6VLm1w81VUGfdTUbtxaI'
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload({
  useTempFiles : true,
}));

app.use('/', indexRouter);
app.use('/api', usersRouter);
app.use('/api', authRouter);

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

app.listen(port, () => {
  console.log(`server listening on ${port}`);
});

module.exports = app;
