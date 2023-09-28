"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();

// Allows you to apply colors to console output.
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";

const PORT = +process.env.PORT || 3001;
let DB_URI = `postgresql://suong:123456789@localhost:5432`;

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
  return process.env.NODE_ENV === "test"
    ? `${DB_URI}/movies_test`
    : process.env.DATABASE_URL || `${DB_URI}/movies`;
}

/** Speed up bcrypt during tests, since the algorithm safety isn't being tested
* WJB: Evaluate in 2021 if this should be increased to 13 for non-test use
* The work factor is set to 1, making the password hashing process faster for testing purposes.
* Otherwise, if NODE_ENV is not "test", the work factor is set to 12, making the hashing process slower and more secure.
**/
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

console.log("Movies Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");


// Import all these constants to use them any where in the app.
module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};
