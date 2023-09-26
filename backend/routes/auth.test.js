"use strict";
/*** To run test:
+ Install supertest: npm i --save-dev supertest
+ Run jest or jest auth.test.js (for specific test file)
*/
const request = require("supertest");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /auth/token */
describe("post/auth/token", function () {
  test("work for auth", async function () {
    const res = await request(app)
      .post("/auth/token")
      .send({ username: "u1", password: "password1" });
    expect(res.body).toEqual({
      "token": expect.any(String),
    });
  });

  test("unauth with non-existent user", async function () {
    const res = await request(app)
      .post("/auth/token")
      .send({ username: "uu1", password: "password1" });
    expect(res.statusCode).toBe(401);
  });

  test("unauth with wrong password", async function () {
    const res = await request(app).post("/auth/token").send({
      username: "u1",
      password: "wrong-password",
    });
    expect(res.statusCode).toBe(401);
  });

  test("bad request with missing data", async function () {
    const res = await request(app).post("/auth/token").send({
      username: "u1",
    });
    expect(res.statusCode).toBe(400);
  });

  test("bad request with invalid data", async function () {
    const res = await request(app).post("/auth/token").send({
      username: 11,
      password: "password",
    });
    expect(res.statusCode).toBe(400);
  });
});

/*********************post/auth/register */

describe("post/auth/register", function () {
  test("work for auth", async function () {
    const res = await request(app).post("/auth/register").send({
      username: "new",
      password: "password",
      firstName: "first",
      lastName: "last",
      email: "new@gmail.com",
    });
    expect(res.body).toEqual({"token": expect.any(String)});
    expect(res.statusCode).toBe(200);

  });
  test("bad request with missing data", async function(){
    const res = await request(app).post("/auth/register").send({
        username: "new",
        password: "password"
    });
    expect(res.statusCode).toBe(400);

  });
  test("bad request with invalid data", async function(){
    const res = await request(app).post("/auth/register").send({
      username: "new",
      password: "password",
      firstName: "first",
      lastName: "last",
      email: "new-email",
    });
    expect(res.statusCode).toBe(400);
  })

});
