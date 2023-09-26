"use strict";
// to run this test file: jest user.test.js
const request = require("supertest");
const app = require("../app");
const Review = require("../models/review.js");

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

/********************post/username/movie_id/add */
describe("post/review/username/movie_id/add", function () {
  test("work for admin", async function () {
    const res = await request(app)
      .post("/review/u1/123/add")
      .send({ comment: "I have watched this movie 3 times" })
      .set("authorization", `Bearer ${adminToken}`);

    expect(res.body).toEqual({
      added: {
        id: expect.any(Number),
        username: "u1",
        movie_id: 123,
        comment: "I have watched this movie 3 times",
        created_at: expect.any(String),
      },
    });
  });
  test("work for the same user", async function () {
    const res = await request(app)
      .post("/review/u1/123/add")
      .send({ comment: "I have watched this movie 3 times" })
      .set("authorization", `Bearer ${u1Token}`);

    expect(res.body).toEqual({
      added: {
        id: expect.any(Number),
        username: "u1",
        movie_id: 123,
        comment: "I have watched this movie 3 times",
        created_at: expect.any(String),
      },
    });
  });
  test("unauth for anyone", async function () {
    const res = await request(app)
      .post("/review/u1/123/add")
      .send({ comment: "I have watched this movie 3 times" });
    expect(res.statusCode).toBe(401);
  });
  test("unauth for not the same user", async function () {
    const res = await request(app)
      .post("/review/u1/123/add")
      .send({ comment: "I have watched this movie 3 times" })
      .set("authorization", `Bearer ${u2Token}`);
    expect(res.statusCode).toBe(401);
  });
  test("not found if no such user", async function () {
    const res = await request(app)
      .post("/review/nope/123/add")
      .send({ comment: "I have watched this movie 3 times" })
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(404);
  });
});

/*************************get/review/movie_id ****/
describe("get/review/movie_id", function () {
  test("works for admin", async function () {
    const res = await request(app)
      .get("/review/123")
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      reviews: [
        {
          id: expect.any(Number),
          username: "u1",
          comment: "This movie is amazing",
          created_at: expect.stringMatching(
            /^20\d{2}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
          ),
        },
        {
          id: expect.any(Number),
          username: "u2",
          comment: "I love this movie",
          created_at: expect.stringMatching(
            /^20\d{2}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
          ),
        },
      ],
    });
  });
  test("works for users", async function () {
    const res = await request(app)
      .get("/review/123")
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.body).toEqual({
      reviews: [
        {
          id: expect.any(Number),
          username: "u1",
          comment: "This movie is amazing",
          created_at: expect.stringMatching(
            /^20\d{2}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
          ),
        },
        {
          id: expect.any(Number),
          username: "u2",
          comment: "I love this movie",
          created_at: expect.stringMatching(
            /^20\d{2}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
          ),
        },
      ],
    });
  });

  test("works for any movie_id without review yet", async function () {
    const res = await request(app)
      .get("/review/678")
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ reviews: [] });
  });

  test("unauth for anyone", async function () {
    const res = await request(app).get("/review/123");
    expect(res.statusCode).toBe(401);
  });
});

/*************************patch/review/id */
describe("patch/review/username/id", function () {
  test("work for admin", async function () {
    let reviewId = (await Review.getReviewByUsernameAndMovieId("u1", 123)).id;
    const res = await request(app)
      .patch(`/review/u1/${reviewId}`)
      .send({ comment: "I love all the characters of this movie" })
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      updatedReview: {
        id: reviewId,
        username: "u1",
        comment: "I love all the characters of this movie",
        movie_id: 123,
        created_at: expect.any(String),
      },
    });
  });
  test("work for the same user", async function () {
    let reviewId = (await Review.getReviewByUsernameAndMovieId("u1", 123)).id;
    const res = await request(app)
      .patch(`/review/u1/${reviewId}`)
      .send({ comment: "I love all the characters of this movie" })
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.body).toEqual({
      updatedReview: {
        id: reviewId,
        username: "u1",
        comment: "I love all the characters of this movie",
        movie_id: 123,
        created_at: expect.any(String),
      },
    });
  });
  test("unauth for mot the same current user", async function () {
    let reviewId = (await Review.getReviewByUsernameAndMovieId("u1", 123)).id;
    const res = await request(app)
      .patch(`/review/u1/${reviewId}`)
      .send({ comment: "I love all the characters of this movie" })
      .set("authorization", `Bearer ${u2Token}`);
    expect(res.statusCode).toBe(401);
  });
  test("unauth for anyone", async function () {
    let reviewId = (await Review.getReviewByUsernameAndMovieId("u1", 123)).id;
    const res = await request(app)
      .patch(`/review/u1/${reviewId}`)
      .send({ comment: "I love all the characters of this movie" });
    expect(res.statusCode).toBe(401);
  });
});

/************************DELETE/review/:username/:id */
describe("delete/review/:username/:id", function () {
  test("work for admin", async function () {
    let reviewId = (await Review.getReviewByUsernameAndMovieId("u1", 123)).id;
    const res = await request(app)
      .delete(`/review/u1/${reviewId}`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({removed: `${reviewId}`})
  });

  test("work for the same", async function () {
    let reviewId = (await Review.getReviewByUsernameAndMovieId("u1", 123)).id;
    const res = await request(app)
      .delete(`/review/u1/${reviewId}`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.body).toEqual({ removed: `${reviewId}` });
  });

  test("unauth for not the same user", async function () {
    let reviewId = (await Review.getReviewByUsernameAndMovieId("u1", 123)).id;
    const res = await request(app)
       .delete(`/review/u1/${reviewId}`)
       .set("authorization", `Bearer ${u2Token}`);
     expect(res.statusCode).toBe(401)
  });

  test("unauth for anyone", async function () {
    let reviewId = (await Review.getReviewByUsernameAndMovieId("u1", 123)).id;
    const res = await request(app)
       .delete(`/review/u1/${reviewId}`);
    expect(res.statusCode).toBe(401);   
  });

  test("not found for no such user", async function () {
    let reviewId = (await Review.getReviewByUsernameAndMovieId("u1", 123)).id;
    const res = await request(app)
       .delete(`/review/nope/${reviewId}`)
       .set("authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  });
});
