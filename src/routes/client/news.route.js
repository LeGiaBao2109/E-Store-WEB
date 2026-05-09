const router = require('express').Router();
const newsController = require('../../controllers/client/news.controller');

router.get('/', newsController.list);

router.get('/detail/', newsController.detail);

router.get('/detail/:id', newsController.detail);

module.exports = router;