const express = require('express');
const router = express.Router();
const connection = require('../lib/db');

router.get('/', function (req, res) {
  res.send("500 施工中！");
});


module.exports = router;