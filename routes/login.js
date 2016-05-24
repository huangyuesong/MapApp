var express = require('express');
var router = express.Router();

// 登陆页
router.get('/', function(req, res, next) {
  res.render('login');
});

module.exports = router;
