"use strict";

const db = require("../db");

//use the functions of bcrypt to hash passwords
//and verify hashed passwords during authentication processes.
const bcrypt = require("bcrypt");

// use this function to handle the update data
const { sqlForPartialUpdate } = require("../helpers/sql");

// Help to handle errors
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

//Use a bcrypt work factor when hashing passwords for secure storage.
const { BCRYPT_WORK_FACTOR } = require("../configs/config.js");

/** Related functions for users. */

class User {
  /** authenticate user with username, password.
   *
   * Returns { username, first_name, last_name, email, is_admin }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/
  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT username, password, first_name AS firstName, last_name AS lastName, email, is_admin AS "isAdmin"
       FROM users
       WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];
    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }
    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data.
   *
   * Returns { username, email, isAdmin }
   *
   * Throws BadRequestError on duplicates.
   **/
  static async register({
    username,
    password,
    firstName,
    lastName,
    email,
    isAdmin,
  }) {
    const duplicateCheck = await db.query(
      `SELECT username FROM users WHERE username = $1`,
      [username]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const result = await db.query(
      `INSERT INTO users (username, password, first_name, last_name, email, is_admin) VALUES ($1, $2, $3, $4, $5, $6) RETURNING username, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"`,
      [username, hashedPassword, firstName, lastName, email, isAdmin]
    );

    const user = result.rows[0];
    return user;
  }

  /** Given a username, return data about user.
   *
   * Returns { username, lastName, lastName, email, is_admin, movieList }
   *   where movieList is {movie_id, movie_name,}
   *
   * Throws NotFoundError if user not found.
   **/
  static async get(username) {
    const result = await db.query(
      `SELECT username, first_name AS "firstName",
                  last_name AS "lastName", email, is_admin AS "isAdmin" FROM users WHERE username = $1`,
      [username]
    );
    const user = result.rows[0];
    console.log(user);
    if (!user) throw new NotFoundError(`No user: ${username}`);

    const userMovieList = await db.query(
      `SELECT m.movie_id, m.movie_name
       FROM movies AS m
       WHERE m.username = $1`,
      [username]
    );

    user.movie_list = userMovieList.rows.map((m) => [m.movie_id, m.movie_name]);

    return user;
  }

  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { password, firstNAME, lastName email, isAdmin }
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws NotFoundError if not found.
   *
   * WARNING: this function can set a new password or make a user an admin.
   * Callers of this function must be certain they have validated inputs to this
   * or a serious security risks are opened.
   */
  // Modify the update function to accept the current password as a separate parameter
  static async update(username, data) {
    // Hash the enter password
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }
    const { setCols, values } = sqlForPartialUpdate(data, {
      firstName: "first_name",
      lastName: "last_name",
      isAdmin: "is_admin",
    });

    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING username, first_name AS "firstName",
                                last_name AS "lastName", email, is_admin AS "isAdmin"`;

    const updateResult = await db.query(querySql, [...values, username]);
    const updatedUser = updateResult.rows[0];

    if (!updatedUser) throw new NotFoundError(`No user: ${username}`);

    delete updatedUser.password;
    return updatedUser;
  }

  /** Delete given user from database; returns undefined. */
  static async remove(username) {
    const result = await db.query(
      `DELETE FROM users WHERE username = $1 RETURNING username`,
      [username]
    );
    const user = result.rows[0];
    if (!user) throw new NotFoundError(`No user: ${username}`);
  }

  /**Add a movie to user's list */

  static async addToList(username, movie_name, movie_id) {
    const preCheck = await db.query(
      `SELECT username FROM users WHERE username = $1`,
      [username]
    );
    const user = preCheck.rows[0];
    if (!user) throw new NotFoundError(`No user: ${username}`);
    const res = await db.query(
      `INSERT INTO movies(username, movie_name, movie_id) VALUES ($1, $2, $3) RETURNING movie_name, movie_id`,
      [username, movie_name, movie_id]
    );
    const movie = res.rows[0];
    return movie;
  }

  /** Remove movie from list */
  static async removeMovie(username, movie_id) {
    const preCheck = await db.query(
      `SELECT username FROM users WHERE username = $1`,
      [username]
    );
    const user = preCheck.rows[0];
    if (!user) throw new NotFoundError(`No user: ${username}`);
    await db.query(`DELETE FROM movies WHERE username = $1 AND movie_id = $2`, [
      username,
      movie_id,
    ]);
  }

  /** Get all movies from user's list */
  static async getMoviesByUsername(username) {
    const preCheck = await db.query(
      `SELECT username FROM users WHERE username = $1`,
      [username]
    );
    const user = preCheck.rows[0];
    if (!user) throw new NotFoundError(`No user: ${username}`);

    const movies = await db.query(
      `SELECT movie_id, movie_name FROM movies WHERE username = $1`,
      [username]
    );
    console.log(movies);
    return movies.rows;
  }
}
module.exports = User;
