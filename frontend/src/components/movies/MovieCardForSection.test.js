import React from "react";
import { render, fireEvent } from "@testing-library/react";
import MovieCardForSection from "./MovieCardForSection";
import UserContext from "../../auth/UserContext";

const base_URL = "http://image.tmdb.org/t/p/original/";

// Mock the functions that are passed as props
const mockHandleClick = jest.fn();
const mockAddMovieToList = jest.fn();
const mockRemoveMovieFromList = jest.fn();
const mockHandleInfo = jest.fn();
const defaultProps = {
  id: 1,
  image: "/path-to-image.jpg",
  title: "Movie Title",
  isLargeRow: true,
  handleClick: mockHandleClick,
  addMovieToList: mockAddMovieToList,
  removeMovieFromList: mockRemoveMovieFromList,
  handleInfo: mockHandleInfo,
};

describe("MovieCardForSection Component", () => {
    test("renders without crashing", () => {
      render(<MovieCardForSection {...defaultProps}/>);
    });

    test("renders movie card with image", () => {
      const { getByAltText } = render(
        <MovieCardForSection {...defaultProps} />
      );
      const imageElement = getByAltText(defaultProps.title);
      expect(imageElement).toBeInTheDocument();
      expect(imageElement).toHaveAttribute(
        "src",
        `${base_URL}${defaultProps.image}`
      );
    });

    test("displays MovieAction when hovered", () => {
      //The addedMovies context value is used in the MovieAction component to determine whether
      //to display the "Add" button (with the plus icon) or the "Remove" button
      const addedMovies = []; // Mock the addedMovies value
      const { getByAltText, getByTestId } = render(
        <UserContext.Provider value={{ addedMovies }}>
          <MovieCardForSection {...defaultProps} />
        </UserContext.Provider>
      );
      const containerElement = getByAltText(defaultProps.title).parentElement;

      // Simulate hovering over the movie card
      fireEvent.mouseEnter(containerElement);
      
      //Find these id inside MovieAction
      const playButton = getByTestId("play-button");
      const plusButton = getByTestId("plus-button");
      const infoButton = getByTestId("info-button");

      expect(playButton).toBeInTheDocument();
      expect(plusButton).toBeInTheDocument();
      expect(infoButton).toBeInTheDocument();

      fireEvent.click(playButton);
      // Expect that the handleClick function was called with the correct arguments
      expect(mockHandleClick).toHaveBeenCalledWith(
        defaultProps.title,
        defaultProps.id
      );
      fireEvent.click(plusButton);
      // Expect that the handleAdd  function was called with the correct arguments
      expect(mockAddMovieToList).toHaveBeenCalledWith(
        defaultProps.title,
        defaultProps.id
      );

      fireEvent.click(infoButton);
      //Expect that the handleInfo  function was called with the correct arguments
      expect(mockHandleInfo).toHaveBeenCalledWith(defaultProps.id);
    });
});


