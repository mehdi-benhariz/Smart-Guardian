const debug = require("debug")("app:loaders");
const express = require("express");
const logger = require("./loaders/logging");
require("dotenv").config({ path: "./config/.env" });
const { getPresence } = require("./utils/data");
const app = express();
require("./loaders/logging");
require("./loaders/routes")(app);
require("./loaders/config")(app);
require("./loaders/database")();

// require("./loaders/validation")();
var qr = require("qr-image");
const { decodeImg } = require("./utils/images");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(
    `Server is listening on port ${PORT} on ${process.env.NODE_ENV} mode`
  );
});
