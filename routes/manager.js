var express = require('express');
var router = express.Router();

// 管理页
router.get('/site', function(req, res, next) {
  res.render('site');
});

router.get('/macRoom', function(req, res, next) {
  res.render('macRoom');
});

module.exports = router;
