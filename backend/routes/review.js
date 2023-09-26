"use strict";
/** Routes for users. */
const express = require("express");
// const jsonschema = require("jsonschema");
const { BadRequestError } = require("../expressError");
const router = new express.Router();
const Review = require("../models/review")
const { ensureCorrectUserOrAdmin, ensureLoggedIn} = require("../middleware/auth");
// const reviewNewSchema = require("../schemas/reviewNew.json");
//const reviewUpdateSchema = require("../schemas/reviewUpdate.json");

/** POST /review/:username/:movieid/add
 * Create a new review
 * Authorization required:  admin or same user-as-:username
 */
router.post(
  "/:username/:movie_id/add",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const { username, movie_id } = req.params;
      const { comment } = req.body;

      const addedReview = await Review.addReview(username, movie_id, comment);

      return res.status(201).json({ added: addedReview });
    } catch (err) {
      return next(err);
    }
  }
);

/** GET /review/:movieid
 * Get all reviews for a specific movie
 * Authorization required:  admin or same user-as-:username
 */
router.get("/:movie_id", ensureLoggedIn, async function (req, res, next) {
  try {
    const reviews = await Review.getReviewsForMovie(req.params.movie_id);
    return res.json({ reviews });
  } catch (err) {
    return next(err);
  }
});

// Get a specific review by username and movie_id
router.get("/:username/:movie_id", ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const { username, movie_id } = req.params;
      const review = await Review.getReviewByUsernameAndMovieId(
        username,
        movie_id
      );

      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }

      return res.json({ review });
    } catch (error) {
      return next(error);
    }
  }
);

/** PUT /review/:id
 * Update a review
 * Authorization required: logged in user or admin
 */

/** PATCH /reviews/:id
 * Update a review
 * Authorization required: logged in user or admin
 */
router.patch("/:username/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    // const validator = jsonschema(req.body, reviewUpdateSchema);
    //     if (!validator.valid){
    //         const errs = validator.errors.map(e => e.stack);
    //         return new BadRequestError(errs);
    //     }
    const { username, id} = req.params;
    const { comment } = req.body;

    const updatedReview = await Review.updateReview(username, id, comment);
    console.log("update", updatedReview);
    

    return res.json({updatedReview});
  } catch (error) {
    return next(error);
  }
});

/** DELETE /review/:id
 * Delete a review
 * Authorization required: logged in user or admin
 */
router.delete("/:username/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
      const { username, id } = req.params;

      await Review.deleteReview(username, id);

      return res.json({ removed: id});
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;
