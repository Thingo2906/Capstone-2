import React, { useState, useEffect, useContext } from "react";
import MovieApi from "../../api/api";
import UserContext from "../../auth/UserContext";
import "./ReviewSection.css"; // Make sure to adjust the path to your CSS file

function ReviewSection({ id }) {
  const { currentUser } = useContext(UserContext);
  const [reviews, setReviews] = useState([]);
  const [newReviewText, setNewReviewText] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);


  console.debug("here is the id", id);

  // Format the created_at date for review
  function formatDate(dateString) {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  useEffect(() => {
    async function fetchReviewsForMovie() {
      const response = await MovieApi.getReviewsForMovie(id);
      const formattedReviews = response.map((review) => ({
        ...review,
        created_at: formatDate(review.created_at),
      }));
      setReviews(formattedReviews);
    }
    fetchReviewsForMovie();
  }, [id]);

  const handleChange = (e) => {
    setNewReviewText(e.target.value);
  };

  const handleAddReview = async (id) => {
    try {
      const newReview = await MovieApi.addReview(
        currentUser.username,
        id,
        newReviewText
      );

      setReviews((prevReviews) => [...prevReviews, {...newReview, created_at: formatDate(newReview.created_at)}]);

      // Clear the new review text
      setNewReviewText("");
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const handleEditReview = async (reviewId, newReview) => {
    try{
      await MovieApi.updateReview(currentUser.username, reviewId, newReview);
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === (reviewId)
          ? { ...review, comment: newReview }
          : review
      )
   
    );
    console.debug("edit review", reviews);

    setEditingReviewId(null);
    setNewReviewText("");


    }catch(error){
       console.error("Error editting review:", error);

    }
    
  };

  const handleDeleteReview = async (id) => {
    try {
      // Optimistically update the state to remove the review
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.id !== id)
      );

      // Make an API call to delete the review
      await MovieApi.deleteReview(currentUser.username, id);
    } catch (error) {
      // Handle any errors
      console.error("Error deleting review:", error);
    }
  };
  const handleCancelEdit = () => {
    setEditingReviewId(null);
  };

  console.debug("currentUser:", currentUser);
  console.debug("reviews", reviews);

  return (
    <div className="review-section">
      <h3 className="review-heading">Reviews</h3>
      {reviews.length === 0 ? (
        <p>No reviews available for this movie.</p>
      ) : (
        <ul className="review-list">
          {reviews.map((review) => (
            <li key={review.id} className="review-item">
              <p className="review-username">
                <strong>{review.username}</strong>{" "}
                <span className="review-created-at">{review.created_at}</span>
              </p>
              <p className="review-comment">{review.comment}</p>

              {currentUser.username === review.username && (
                <>
                  {editingReviewId === review.id ? (
                    <div className="edit-review-form">
                      <textarea
                        className="edit-review-textarea"
                        value={newReviewText}
                        onChange={handleChange}
                        placeholder="Edit your review..."
                      />
                      <button
                        className="edit-review-submit"
                        onClick={() =>
                          handleEditReview(review.id, newReviewText)
                        }
                      >
                        Submit
                      </button>
                      <button
                        className="edit-review-cancel"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="review-buttons">
                      <button
                        className="edit-review-button"
                        onClick={() => setEditingReviewId(review.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-review-button"
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {currentUser.username && (
        <div className="add-review-section">
          <textarea
            className="add-review-textarea"
            value={newReviewText}
            onChange={handleChange}
            placeholder="Write your review..."
          />
          <button
            className="add-review-button"
            onClick={() => handleAddReview(id)}
          >
            Add Review
          </button>
        </div>
      )}
    </div>
  );
}

export default ReviewSection;
