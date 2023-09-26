"use strict";
// to run this test file: jest user.test.js
const request = require("supertest");
const app = require("../app");
const User = require("../models/user");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  adminToken,
  testMovie1,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/******************post/user */
describe("post/user", function () {
  test("work for admin: create non-admin", async function () {
    const res = await request(app)
      .post("/user")
      .send({
        username: "new",
        password: "newPassword",
        firstName: "first",
        lastName: "last",
        email: "new@gmail.com",
        isAdmin: false,
      })
      .set("authorization", `Bearer ${adminToken}`);

    expect(res.body).toEqual({
      user: {
        username: "new",
        firstName: "first",
        lastName: "last",
        email: "new@gmail.com",
        isAdmin: false,
      },
      token: expect.any(String),
    });
    expect(res.statusCode).toBe(201);
  });
  test("work for admin: create an admin", async function () {
    const res = await request(app)
      .post("/user")
      .send({
        username: "new1",
        password: "newPassword",
        firstName: "first",
        lastName: "last",
        email: "new1@gmail.com",
        isAdmin: true,
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      user: {
        username: "new1",
        firstName: "first",
        lastName: "last",
        email: "new1@gmail.com",
        isAdmin: true,
      },
      token: expect.any(String),
    });
    expect(res.statusCode).toBe(201);
  });
  test("unauth for users", async function () {
    const res = await request(app)
      .post("/user")
      .send({
        username: "new1",
        password: "newPassword",
        firstName: "first",
        lastName: "last",
        email: "new1@gmail.com",
        isAdmin: true,
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toBe(401);
  });
  test("unauth for anyone", async function () {
    const res = await request(app).post("/user").send({
      username: "new1",
      password: "newPassword",
      firstName: "first",
      lastName: "last",
      email: "new1@gmail.com",
      isAdmin: true,
    });
    expect(res.statusCode).toBe(401);
  });
});

describe("GET /user/username", function () {
  test("works for admins", async function () {
    const resp = await request(app)
      .get("/user/u1")
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      user: {
        username: "u1",
        firstName: "user1",
        lastName: "tester1",
        email: "u1@gmail.com",
        isAdmin: false,
        movie_list: testMovie1[0],
      },
    });
  });
  test("works for the same user", async function () {
    const resp = await request(app)
      .get("/user/u1")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      user: {
        username: "u1",
        firstName: "user1",
        lastName: "tester1",
        email: "u1@gmail.com",
        isAdmin: false,
        movie_list: testMovie1[0],
      },
    });
  });
  test("unauth for other users", async function () {
    const resp = await request(app)
      .get(`/user/u1`)
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anyone", async function () {
    const resp = await request(app).get(`/user/u1`);
    expect(resp.statusCode).toEqual(401);
  });
  test("not found if user not found", async function () {
    const resp = await request(app)
      .get(`/user/nope`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});



/************************************** PATCH /user/:username */
describe("patch/user/:username", function () {
  test("work for admin", async function () {
    //the updatedData doesn't require to update all the fields
    const res = await request(app)
      .patch("/user/u1")
      .send({ firstName: "new1", password: "password1"})
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      user: {
        username: "u1",
        firstName: "new1",
        lastName: "tester1",
        email: "u1@gmail.com",
        isAdmin: false,
      },
    });
  });
  test("work for any user", async function () {
    const res = await request(app)
      .patch("/user/u1")
      .send({ firstName: "new1", password: "password1"})
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.body).toEqual({
      user: {
        username: "u1",
        firstName: "new1",
        lastName: "tester1",
        email: "u1@gmail.com",
        isAdmin: false,
      },
    });
  });
  test("unauth if not same user", async function(){
    const res = await request(app)
      .patch("/user/u1")
      .send({ firstName: "new1", password: "password1" })
      .set("authorization", `Bearer ${u2Token}`);
    expect(res.statusCode).toBe(401)
  });
  test("unauth for anyone", async function(){
    const res = await request(app)
      .patch("/user/u1")
      .send({ firstName: "new1", password: "password1" });
    expect(res.statusCode).toBe(401);
  
  });
  test("not found if no such user", async function(){
    const res = await request(app)
      .patch("/user/nope")
      .send({ firstName: "new1", password: "password1" })
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(404);
  });

  test("works: can set new password", async function () {
    const resp = await request(app)
      .patch(`/user/u1`)
      .send({
        password: "new-password",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      user: {
        username: "u1",
        firstName: "user1",
        lastName: "tester1",
        email: "u1@gmail.com",
        isAdmin: false,
      },
    });
    const isSuccessful = await User.authenticate("u1", "new-password");
    expect(isSuccessful).toBeTruthy();
  });
});
