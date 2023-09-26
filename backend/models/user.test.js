"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const User = require("./user.js");
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

/*****************************authenticate */
describe("authenticate", function () {
  test("works", async function () {
    const user = await User.authenticate("u1", "password1");
    expect(user).toEqual({
      username: "u1",
      firstname: "user1",
      lastname: "tester",
      email: "u1@gmail.com",
      isAdmin: false,
    });
  });
  test("unauth if no such user", async function () {
    try {
      await User.authenticate("a1", "password");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
  test("unauth if wrong password", async function () {
    try {
      await User.authenticate("u1", "wrong");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

/***************************register */
describe("register", function () {
  const newUser = {
    username: "new",
    firstName: "newUser",
    lastName: "newTester",
    email: "new@gmail.com",
    isAdmin: false,
  };

  test("works for new user", async function () {
    const user = await User.register({ ...newUser, password: "password" });
    expect(user).toEqual(newUser);
    const found = await db.query("SELECT * FROM users WHERE username = 'new' ");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].is_admin).toEqual(false);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });
  test("work with admin user", async function () {
    const user = await User.register({
      ...newUser,
      password: "password",
      isAdmin: true,
    });
    expect(user).toEqual({...newUser, isAdmin: true});
    const found = await db.query("SELECT * FROM users WHERE username = 'new'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].is_admin).toEqual(true);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });
  test("bad request with dup data", async function () {
    try {
      await User.register({
        ...newUser,
        password: "password",
      });
      await User.register({
        ...newUser,
        password: "password",
      });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/********************get curentUser*******/
describe("get", function () {
  test("work", async function () {
    const user = await User.get("u1");
    expect(user).toEqual({
      username: "u1",
      firstName: "user1",
      lastName: "tester",
      email: "u1@gmail.com",
      isAdmin: false,
      movie_list: [[123, 'The Flash']],
    });
  });
  test("not found if no such user", async function () {
    try {
      await User.get("unknown");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/**********************Update*********/
describe("update", function () {
  const updateData = {
    firstName: "newUser",
    lastName: "newTester",
    email: "newUser@gmail.com",
    isAdmin: true,
    password: "password1",
  };
  test("work", async function () {
    let user = await User.update("u1", updateData);
    expect(user).toEqual({
      username: "u1",
      firstName: "newUser",
      lastName: "newTester",
      email: "newUser@gmail.com",
      isAdmin: true,
    });
  });
  test("work to set password", async function () {
    let user = await User.update("u1", { password: "new" });
    expect(user).toEqual({
      username: "u1",
      firstName: "user1",
      lastName: "tester",
      email: "u1@gmail.com",
      isAdmin: false,
    });

    const found = await db.query(`SELECT * FROM users WHERE username = 'u1'`);
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });
  test("not found if no such user", async function () {
    try {
      await User.update("nope", { firstName: "test" });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
  test("bad request if no such password", async function () {
    try {
      await User.update("u1", {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/**************remove*************/

describe("remove", function () {
  test("work", async function () {
    await User.remove("u1");
    let user = await db.query(`SELECT * FROM users WHERE username = 'u1'`);
    expect(user.rows.length).toEqual(0);
  });
  test("not found if no such user", async function () {
    try {
      await User.remove("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/***************Add movie to list */
describe("add movie", function () {
  test("work", async function () {
    await User.addToList("u1", "The moon", 145);
    const res = await db.query(`SELECT * from movies WHERE username = 'u1'`);
    expect(res.rows).toEqual([
      {
        id: expect.any(Number),
        movie_id: 123,
        movie_name: "The Flash",
        username: "u1",
      },
      {
        id: expect.any(Number),
        movie_id: 145,
        movie_name: "The moon",
        username: "u1",
      },
    ]);
  });
  test("not found if no such user", async function () {
    try {
      await User.addToList("nope", "The queen", 678);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
 
});

/****************** remove movie ********/
describe("remove movie", function () {
  test("work", async function () {
    await User.removeMovie("u1", 123);
    const res = await db.query(
      `SELECT * FROM movies WHERE username = 'u1' AND movie_id = 123`
    );
    expect(res.rows.length).toEqual(0);
  });
  test("not found if no user", async function () {
    try {
      await User.removeMovie("u4", 123);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/********************get movies list by username */
describe("get movies by usrename", function () {
  test("work", async function () {
    let movies = await User.getMoviesByUsername("u1");
    expect(movies[0]).toEqual({
      movie_id: 123,
      movie_name: "The Flash",
    });
  });

  test("not found if no such user", async function () {
    try {
      await User.getMoviesByUsername("u4");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
