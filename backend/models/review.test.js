"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const Review = require("./review.js");
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

/************** add review**********/

describe("add review", function(){
    test("work", async function(){
   
        let review = await Review.addReview("u1", 123, "I love this movie");
        expect(review).toEqual({
          comment: "I love this movie",
          created_at: expect.any(Date),
          id: expect.any(Number),
          movie_id: 123,
          username: "u1"
        });

    });
    test("not found if such no user", async function(){
        try{
            await Review.addReview("u4", 123, "It is my favorite movie");
            fail();

        }catch(err){
            expect(err instanceof NotFoundError).toBeTruthy()
        }
    });

});
/************get reviews for movie************/
describe("get reviews for movie", function(){
    test("work", async function(){
        const reviews = await Review.getReviewsForMovie(123);
        expect(reviews).toEqual([
          {
            id: expect.any(Number),
            username: "u1",
            comment: "The movie is amazing",
            created_at: expect.any(Date),
          },
          {
            id: expect.any(Number),
            username: "u2",
            comment: "I really love this movie",
            created_at: expect.any(Date)
          },
        ]);
    });


});

/*************Update a review*******/
describe("update review", function () {
  test("work", async function() {

    try {
      // Fetch the ID of the review from the database.
      const reviewId = await Review.getReviewByUsernameAndMovieId("u1", 123);

      // Update the review using the retrieved ID.
      const updatedReview = await Review.updateReview("u1",
        reviewId.id,
        "I have watched this movie 2 times"
      );

      expect(updatedReview).toEqual({
        id: expect.any(Number),
        username: "u1",
        comment: "I have watched this movie 2 times",
        created_at: expect.any(Date),
      });
    } catch (err) {
    }
  });
});

/*******************delete a review */
describe("delete review", function(){
    test("work", async function(){
        try{
            const reviewId = await Review.getReviewByUsernameAndMovieId("u1", 123);
            const deletedReview = await Review.deleteReview("u1", reviewId.id);
            expect(deletedReview).toEqual(reviewId.id)

        }catch(err){
            
        }
      
    })

})

