"use strict";

/** Routes for authentication. */
const express = require("express");
const jsonschema = require("jsonschema");
const { ExpressError } = require( "../expressError" );
const User = require("../models/user");
const router = new express.Router();
const {createToken} = require("../helpers/token");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const {BadRequestError} = require("../expressError");

/** POST /auth/token:  { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

// This route is for login and it will create a token when user login
router.post("/token", async function(req, res, next){
    try{
        const validator = jsonschema.validate(req.body, userAuthSchema);
        if(!validator.valid){
            const errors = validator.errors.map(e => e.stack);
            throw new BadRequestError(errors);

        }
        const {username, password}= req.body;
        const user = await User.authenticate(username, password);
        const token = createToken(user);
        return res.json({token});

    }catch(err){
        return next(err);
    }
})

/** POST /auth/register:   { user } => { token }
 *
 * user must include { username, password, firstName, lastName, email }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */
// iT will create a token when the user sign up
router.post("/register", async function(req, res, next){
    try{
        const validator = jsonschema.validate(req.body, userRegisterSchema);
        if(!validator.valid){
            const errors = validator.errors.map(e => e.stack);
            throw new BadRequestError(errors);
        }
        const newUser = await User.register({...req.body, isAdmin: false});
        const token = createToken(newUser);
        return res.json({token});
    }catch(err){
        return next(err);
    }
})
module.exports = router;