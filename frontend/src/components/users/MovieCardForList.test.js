import React from "react";
import { render, fireEvent } from "@testing-library/react";

import UserContext from "../../auth/UserContext";
import MovieCardForList from "./MovieCardForList";

const base_URL = "http://image.tmdb.org/t/p/original/";


const mockRemoveMovieFromList = jest.fn();
const mockHandleClick = jest.fn();
const mockHandleInfo = jest.fn();

const defaultProps = {
  id: 1,
  image: "/path-to-image.jpg",
  name: "Movie name",
  handleClick: mockHandleClick,
  isLargeRow: true,
  removeMovieFromList: mockRemoveMovieFromList,
  handleInfo: mockHandleInfo,
};


describe("MovieCardForList Component", () => {
  test("renders without crashing", () => {
    render(<MovieCardForList {...defaultProps} />);
  });

  test("renders movie card with image", () => {
    const { getByAltText } = render(<MovieCardForList {...defaultProps} />);
    const imageElement = getByAltText(defaultProps.name);
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
        <MovieCardForList {...defaultProps}/>
        </UserContext.Provider>
     
    );
    const containerElement = getByAltText(defaultProps.name).parentElement;

    // Simulate hovering over the movie card
    fireEvent.mouseEnter(containerElement);

    //Find these id inside MovieAction
    const playButton = getByTestId("play-button");
    const minusButton = getByTestId("minus-button");
    const infoButton = getByTestId("info-button");

    expect(playButton).toBeInTheDocument();
    expect(minusButton).toBeInTheDocument();
    expect(infoButton).toBeInTheDocument();

    fireEvent.click(playButton);
    // Expect that the handleClick function was called with the correct arguments
    expect(mockHandleClick).toHaveBeenCalledWith(
      defaultProps.name,
      defaultProps.id
    );
    fireEvent.click(minusButton);
    // Expect that the handleAdd  function was called with the correct arguments
    expect(mockRemoveMovieFromList).toHaveBeenCalledWith(
      defaultProps.id
    );

    fireEvent.click(infoButton);
    //Expect that the handleInfo  function was called with the correct arguments
    expect(mockHandleInfo).toHaveBeenCalledWith(defaultProps.id);
  });



})