var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 업로드 폴더가 존재하는지 확인하고 없으면 생성
var uploadDir = path.join(__dirname, 'uploads');
console.log('업로드 디렉토리 경로:', uploadDir);
console.log('디렉토리 존재 여부:', fs.existsSync(uploadDir));

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('uploads 디렉토리가 생성되었습니다.');
  } else {
    console.log('uploads 디렉토리가 이미 존재합니다.');
  }
} catch (error) {
  console.error('디렉토리 생성 중 오류 발생:', error);
}

// 업로드된 파일에 접근할 수 있는 경로 설정
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
