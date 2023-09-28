
import React from "react";
import { render, fireEvent, waitFor, getByTestId } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect"; // For additional matchers like toBeInTheDocument
import ReviewSection from "./ReviewSection";
import UserContext from "../../auth/UserContext";


// Mock the MovieApi module
jest.mock("../../api/api", () => ({
  __esModule: true,
  default: {
    getReviewsForMovie: async () => [
      {
        id: 1,
        username: "testuser",
        created_at: "2023-09-30T12:34:56.789Z",
        comment: "Good movie!",
      },
      {
        id: 2,
        username: "testuser1",
        created_at: "2023-09-30T13:45:00.000Z",
        comment: "Didn't like it",
      },
    ],
    // Mock other MovieApi methods as needed
  },
}));

describe("ReviewSection Component", () => {
  test("renders reviews from API", async () => {
    const currentUser = {username: "testuser"};

       // Render component with mock data
    const { getByText, getByPlaceholderText } = render(
      <UserContext.Provider value={{ currentUser }}>
        <ReviewSection id={123} />
      </UserContext.Provider>
    );
  

    // Wait for the reviews to load
    await waitFor(() => {
      expect(getByText("Good movie!")).toBeInTheDocument();
      expect(getByText("Didn't like it")).toBeInTheDocument();
    });
   
    const addReviewTextarea = getByPlaceholderText("Write your review...");
    const addReviewButton = getByText("Add Review");
    expect(addReviewTextarea).toBeInTheDocument();
    expect(addReviewButton).toBeInTheDocument();

  
  });
  test("adds a new review and interacts with edit button", async () => {
    const currentUser = { username: "testuser" };

    // Render component with mock data
    const { getByText, getByPlaceholderText, getByTestId, container } = render(
      <UserContext.Provider value={{ currentUser }}>
        <ReviewSection id={123} />
      </UserContext.Provider>
    );

    // Find the textarea for adding a review and change its value
    const addReviewTextarea = getByPlaceholderText("Write your review...");

    fireEvent.change(addReviewTextarea, {
      target: { value: "New review text" },
    });

    // Find the "Add Review" button and click it
    const addReviewButton = getByText("Add Review");
    fireEvent.click(addReviewButton);

    // Wait for the new review to appear
    await waitFor(() => {
      expect(getByText("New review text")).toBeInTheDocument();
      expect(getByText("Good movie!")).toBeInTheDocument();
    });

    // Now, wait for the edit button to appear and interact with it
    await waitFor(() => {
      const editButton = getByTestId("edit-button-1"); // Assuming the new review has an id of 1
      expect(editButton).toBeInTheDocument();
      fireEvent.click(editButton);

      // For example, you can interact with the edit textarea and submit button here
      const editReviewTextarea = getByTestId(`edit-review-textarea-1`);
      fireEvent.change(editReviewTextarea, {
        target: { value: "Edited review text" },
      });

      const submitEditButton = getByText("Submit");
      fireEvent.click(submitEditButton);

      // Wait for the edited review text to appear
      waitFor(() => {
        expect(getByText("Edited review text")).toBeInTheDocument();
      });
    });
  });
});




  