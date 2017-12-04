const router = require('express').Router();
const favoriteTagsController = require('../../controllers/favoriteTags');
const auth = require('../auth');

router.get('/', auth.required, favoriteTagsController.get)

module.exports = router;