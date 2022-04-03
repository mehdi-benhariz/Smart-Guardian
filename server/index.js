const debug = require("debug")("app:loaders");
const express = require("express");
const logger = require("./loaders/logging");
require("dotenv").config({ path: "./config/.env" });
const app = express();
const path = require("path");
const { getPresence } = require("./utils/data");
app.use("/", express.static(path.join(__dirname, "public"))); //  "public" off of current is root

// app.use(express.static("public"));
require("./loaders/logging");
require("./loaders/database").init();
require("./loaders/config")(app);
require("./loaders/routes")(app);

// require("./loaders/validation")();
app.get("/test", async (req, res) => {
  const data = await getPresence();
  res.send(data);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(
    `Server is listening on port ${PORT} on ${process.env.NODE_ENV} mode`
  );
});
