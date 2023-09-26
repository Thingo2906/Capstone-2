const bcrypt = require("bcrypt");
const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");


async function commonBeforeAll() {
  // Empty all tables
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM movies");
  await db.query("DELETE FROM reviews");

  // insert new record
  await db.query(
    `INSERT INTO users (username, first_name, last_name, password, email)
     VALUES ('u1', 'user1', 'tester', $1, 'u1@gmail.com'),
     ('u2', 'user2', 'tester', $2, 'u2@gmail.com') RETURNING username`,
    [
      await bcrypt.hash('password1', BCRYPT_WORK_FACTOR),
      await bcrypt.hash('password2', BCRYPT_WORK_FACTOR)
    ]
  );

  const movies = await db.query(
    `INSERT INTO movies 
    (username, movie_name, movie_id) 
    VALUES ('u1', 'The Flash', 123), ('u2', 'Avatar', 345) RETURNING movie_name, movie_id`
  );
 

  await db.query(
    `INSERT INTO reviews 
    (username, movie_id, comment, created_at) 
    VALUES ('u1', 123, 'The movie is amazing', CURRENT_TIMESTAMP),
    ('u2', 123, 'I really love this movie', CURRENT_TIMESTAMP)
    `
  );
}
async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,

};
