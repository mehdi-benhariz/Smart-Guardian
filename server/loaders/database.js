const mongoose = require("mongoose");
const logger = require("./logging");
const redis = require("redis");
const debug = require("debug")("app:loaders");
var client = redis.createClient();
module.exports = {
  init: function () {
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
    client.connect();
    client.on("error", (err) => {
      logger.error(`Error: ${err}`);
    });
    client.on("connect", () => {
      logger.info(`redis is connected`);
    });
  },
  redisClient: client,
};
// await client.connect();
