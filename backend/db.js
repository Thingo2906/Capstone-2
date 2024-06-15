"use strict";
/** Database setup for Movies. */
const { Client } = require("pg");
<<<<<<< HEAD
const { getDatabaseUri } = require("./configs/config.js");
=======
const { getDatabaseUri } = require("./configs/config");
>>>>>>> 64b155b3b97011539add7ce70c47bdc44d58974c

let db;

if (process.env.NODE_ENV === "production") {
  db = new Client({
    connectionString: getDatabaseUri(),
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  db = new Client({
    connectionString: getDatabaseUri(),
  });
}

db.connect();

module.exports = db;
