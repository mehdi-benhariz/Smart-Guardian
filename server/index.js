const debug = require("debug")("app:loaders");
const express = require("express");
const logger = require("./loaders/logging");
require("dotenv").config({ path: "./config/.env" });
const { getPresence, getPresenceByEmployee } = require("./utils/data");
const app = express();
require("./loaders/logging");
require("./loaders/database")();
require("./loaders/config")(app);
require("./loaders/routes")(app);

// require("./loaders/validation")();
var qr = require("qr-image");
const { decodeImg } = require("./utils/images");

app.get("/", async (req, res) => {
  // getPresence();
  res.send("ok");
  console.log(await getPresenceByEmployee("1111111"));
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(
    `Server is listening on port ${PORT} on ${process.env.NODE_ENV} mode`
  );
});
