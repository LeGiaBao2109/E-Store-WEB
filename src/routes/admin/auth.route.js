
const router = require('express').Router();

const adminController = require('../../controllers/admin/auth.controller');

router.get('/', adminController.auth);

module.exports = router;