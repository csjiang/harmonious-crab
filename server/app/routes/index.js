'use strict';

const router = require('express').Router();
module.exports = router;

router.use('/communique', require('./communique'));

router.use(function (req, res) {
  res.status(404).send('Route not found');
});
