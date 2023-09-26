"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");

class Review {
  /**
   * Create a review
   */
  static async addReview(username, movie_id, comment) {
    const preCheck = await db.query(
      `SELECT username FROM users WHERE username = $1`,
      [username]
    );
    const user = preCheck.rows[0];
    if (!user) throw new NotFoundError(`No user: ${username}`);

    const currentTimestamp = new Date();

    const result = await db.query(
      `INSERT INTO reviews (username, movie_id, comment, created_at) VALUES ($1, $2, $3, $4) RETURNING id, username, movie_id, comment, created_at`,
      [username, movie_id, comment, currentTimestamp]
    );
    const newReview = result.rows[0];
    return newReview;
  }

  /**Get all reviews for a movie from users */
  static async getReviewsForMovie(movie_id) {
    const result = await db.query(
      `SELECT id, username, comment, created_at FROM reviews WHERE movie_id = $1`,
      [movie_id]
    );
    
    const reviews = result.rows;
    return reviews;
  }

  //Get review by user and movie_Id
  static async getReviewByUsernameAndMovieId(username, movie_id) {
    const preCheck = await db.query(
      `SELECT username FROM users WHERE username = $1`,
      [username]
    );
    const user = preCheck.rows[0];
    if (!user) throw new NotFoundError(`No user: ${username}`);

    const result = await db.query(
      `SELECT id, comment, created_at FROM reviews
       WHERE username = $1 AND movie_id = $2`,
      [username, movie_id]
    );

    const review = result.rows[0];
    return review;
  }

  //update a review.
  static async updateReview(username, id, comment) {
    const result = await db.query(
      `UPDATE reviews SET comment = $1 WHERE username = $2 AND id = $3 RETURNING id, username, movie_id, comment, created_at`,
      [comment, username, id]
    );
    const review = result.rows[0];
    return review;
  }

  //Delete a review.
  static async deleteReview(username, id) {
    const result = await db.query(
      `DELETE FROM reviews WHERE username= $1 AND id = $2 RETURNING id`,
      [username, id]
    );
    const deletedReview = result.rows[0];

    if (!deletedReview) {
      throw new NotFoundError(`No review with ID: ${id}`);
    }
  }
}

module.exports = Review;
