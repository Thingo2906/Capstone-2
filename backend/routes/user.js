"use strict";
/** Routes for users. */
const express = require("express");
const jsonschema = require("jsonschema");
const { BadRequestError } = require("../expressError");
const router = new express.Router();
const User = require("../models/user");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { createToken } = require("../helpers/token");

/** POST / { user }  => { user, token }
 *
 * Adds a new user. This is not the registration endpoint --- instead, this is
 * only for admin users to add new users. The new user being added can be an
 * admin.
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: { username, firstName, lastName, email, isAdmin }, token }
 *
 * Authorization required: admin
 **/
router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userNewSchema);
    if (!validator.valid) {
      const errs = validator.errs.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const user = await User.register(req.body);
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
});

/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName isAdmin, movieList }
 *   where movieList is [[movie_id, movie_name]]
 *
 * Authorization required: admin or same user-as-:username
 **/
router.get(
  "/:username",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const user = await User.get(req.params.username);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }
);

/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, password, email }
 *
 * Returns { username, email, isAdmin }
 *
 * Authorization required: admin or same-user-as-:username
 **/
router.patch(
  "/:username",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, userUpdateSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        return new BadRequestError(errs);
      }
      const user = await User.update(req.params.username, req.body);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }
);

/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.delete(
  "/:username",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      await User.remove(req.params.username);
      return res.json({ deleted: req.params.username });
    } catch (err) {
      return next(err);
    }
  }
);

/** POST /[username]/[id]/[moviename] { state } => { movielist }
 *
 * Returns {"added": {movie_id, movie_name}}
 *
 * Authorization required: admin or same-user-as-:username
 * */

router.post(
  "/:username/:movie_name/:movie_id/add",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const movie_id = req.params.movie_id;
      const movie_name = req.params.movie_name;
      await User.addToList(req.params.username, movie_name, movie_id);
      return res.json({
        added: { movie_name, movie_id },
      });
    } catch (err) {
      return next(err);
    }
  }
);

/** DELETE /[username]/[moviename]/[id]  { state } => { movielist }
 *
 * Returns {"removed": {movie_id}}
 *
 * Authorization required: admin or same-user-as-:username
 * */
router.delete("/:username/:movie_id/remove",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const { username, movie_id } = req.params;
      await User.removeMovie(username, movie_id);
      return res.json({ removed: movie_id });
    } catch (err) {
      return next(err);
    }
  }
);

// router.get(
//   "/:username/movies",
//   ensureCorrectUserOrAdmin,
//   async function (req, res, next) {
//     try {
//       // Query your database to get movies for the given username
//       const username = req.params.username;
//       const movies = await User.getMoviesByUsername(username);
//       return res.json({ movies: movies });
//     } catch (error) {
//       return next(error);
//     }
//   }
// );

module.exports = router;
