"use strict";
const db = require("../db.js");
const User = require("../models/user.js");
const Review = require("../models/review.js");
const { createToken } = require("../helpers/token");

const testMovie1 = [];

async function commonBeforeAll() {
  await db.query(`DELETE FROM users`);
  await db.query(`DELETE FROM reviews`);
  await db.query(`DELETE FROM movies`);

  await User.register({
    username: "u1",
    password: "password1",
    firstName: "user1",
    lastName: "tester1",
    email: "u1@gmail.com",
    isAdmin: false,
  });

  await User.register({
    username: "u2",
    password: "password2",
    firstName: "user2",
    lastName: "tester2",
    email: "u2@gmail.com",
    isAdmin: false,
  });

  await User.register({
    username: "u3",
    password: "password3",
    firstName: "user3",
    lastName: "tester3",
    email: "u3@gmail.com",
    isAdmin: false,
  });

  await Review.addReview("u1", 123, "This movie is amazing");
  await Review.addReview("u2", 123, "I love this movie");

  


  await User.addToList("u1", "The Flash", 123);
  await User.addToList("u2", "The queen", 456);
  testMovie1[0] = (await User.get("u1")).movie_list;
}

async function commonBeforeEach(){

    await db.query("BEGIN");
 }


async function commonAfterEach(){
   await db.query("ROLLBACK");

}

async function commonAfterAll() {
  await db.end();
}

const u1Token = createToken({ username: "u1", isAdmin: false });
const u2Token = createToken({ username: "u2", isAdmin: false });
const adminToken = createToken({ username: "admin", isAdmin: true });

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  adminToken,
  testMovie1,
};
