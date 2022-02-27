const debug = require("debug")("app:loaders");
const express = require("express");
const logger = require("./loaders/logging");
require("dotenv").config({ path: "./config/.env" });

const app = express();
require("./loaders/logging");
require("./loaders/routes")(app);
require("./loaders/config")(app);
require("./loaders/database")();

// require("./loaders/validation")();
var qr = require("qr-image");
const { decodeImg } = require("./utils/images");

app.get("/", function (req, res) {
  var code = qr.image(new Date().toString(), { type: "svg" });
  // res.type("svg");
  // code.pipe(res);
  decodeImg(code, "test");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(
    `Server is listening on port ${PORT} on ${process.env.NODE_ENV} mode`
  );
});
