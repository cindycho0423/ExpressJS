var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var fs = require('fs');

// 업로드 디렉토리 경로 설정
var uploadDir = path.join(__dirname, '../uploads');

// Multer 설정
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // 타임스탬프 + 원본 파일 확장자로 파일명 설정
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// 파일 필터 - 이미지 파일만 허용
var fileFilter = function (req, file, cb) {
  // 허용할 이미지 타입
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('이미지 파일만 업로드 가능합니다.'), false);
  }

  cb(null, true);
};

var upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB 제한
  },
});

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log('인덱스 페이지 접속');
  res.render('index', { title: '이미지 업로더' });
});

/* POST image upload */
router.post('/', upload.single('myFile'), function (req, res, next) {
  console.log('파일 업로드 요청 받음');

  if (!req.file) {
    console.log('업로드된 파일 없음');
    return res.status(400).json({
      success: false,
      message: '파일이 업로드되지 않았습니다.',
    });
  }

  console.log('파일 업로드 성공:', req.file.path);

  // 클라이언트에 응답
  res.json({
    success: true,
    message: '파일 업로드 성공!',
    filePath: '/uploads/' + req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    mimeType: req.file.mimetype,
  });
});

module.exports = router;
