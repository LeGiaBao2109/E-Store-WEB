const express = require('express');
const router = express.Router();
const productController = require('../../controllers/client/product.controller');

router.get('/', productController.list);

router.get('/:slugCategory', productController.category);

router.get('/detail/:slugProduct', productController.detail);

module.exports = router;