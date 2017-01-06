'use strict';

const express = require('express');
const mime = require('mime');
const router = express.Router();
const models = require('../../db/models');
const Communique = models.Communique;

module.exports = router;

router.get('/', function(req, res, next) {
	Communique.findAll()
	.then(communiques => res.json(communiques))
	.catch(next);
});

router.param('communiqueId', (req, res, next, id) => {
  Communique.findById(id)
  .then(function (communique) {
    if (!communique) {
      const err = Error('Entry not found');
      err.status = 404;
      throw err
    }
    req.communique = communique;
    next();
    return null; // silences bluebird warning about promises inside of next
  })
  .catch(next);
});

router.get('/:communiqueId', (req, res) => {
  res.json(req.communique);
});

router.get('/searchByTitle/:titleKeywords', (req, res, next) => {
  Communique.findByTitle(req.params.titleKeywords)
  .then(matches => res.json(matches))
  .catch(next);
});

router.get('/searchByContent/:contentKeywords', (req, res, next) => {
  Communique.findByContent(req.params.contentKeywords)
  .then(matches => res.json(matches))
  .catch(next);
});


//TODO: figure out a good way to implement filtering results display by language
router.get('/chinese', (req, res, next) => {
  Communique.findByLanguage('中文')
  .then(matches => res.json(matches))
  .catch(next);
});

router.get('/english', (req, res, next) => {
  Communique.findByLanguage('English')
  .then(matches => res.json(matches))
  .catch(next);
});
