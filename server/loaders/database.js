const mongoose = require("mongoose");
const logger = require("./logging");
const debug = require("debug")("app:loaders");

module.exports = function () {
  const dbURI = process.env.MONGO_URI;
  mongoose.connect(dbURI);

  mongoose.connection.on("connected", () =>
    logger.info(`mongoose is connected `)
  );

  mongoose.connection.on("error", (err) =>
    debug(`Error connecting to db ${err}`)
  );

  mongoose.connection.on("disconnected", () => {
    debug(`Mongoose is disconnected`);
  });

  process.on("SIGINT", () => {
    debug("Mongoose disconnected on exit process");
    process.exit(0);
  });
};
