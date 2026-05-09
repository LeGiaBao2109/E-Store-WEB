const express = require('express');
const path = require('path');
require('dotenv').config();

const clientRoutes = require('./src/routes/client/index.route');
const adminRoutes = require('./src/routes/admin/index.route');
const sitemapRoutes = require("./src/routes/sitemap.route");

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'src/public')));

app.use("/", clientRoutes);
app.use("/admin", adminRoutes);
app.use("/sitemap", sitemapRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})