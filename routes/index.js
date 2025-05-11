var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');

// Multer 설정
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/')); // 절대 경로로 변경
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // 파일 이름 설정
  },
});

var upload = multer({ storage: storage });

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log('index 페이지로 접속함');
  res.render('index', { title: '이미지 업로더' });
});

/* POST image upload */
router.post('/', upload.single('myFile'), function (req, res, next) {
  console.log('파일 업로드 요청 받음');
  if (!req.file) {
    console.log('업로드된 파일 없음');
    return res.status(400).send('No file uploaded.');
  }

  console.log('파일 업로드 성공: ' + req.file.path);
  res.send({
    success: true,
    message: 'File uploaded successfully.',
    filePath: '/uploads/' + req.file.filename,
  });
});

module.exports = router;
