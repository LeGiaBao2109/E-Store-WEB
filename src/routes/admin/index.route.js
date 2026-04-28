const router = require("express").Router();

const adminRoutes = require("./admin.route");
const authAdminRoutes = require("./auth.route");

router.use('/', adminRoutes);

router.use('/auth', authAdminRoutes);

module.exports = router;