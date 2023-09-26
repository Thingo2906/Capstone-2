import React from "react";
import { render } from "@testing-library/react";
import MovieList from "./MovieList";
import MovieApi from "../../api/api";
import UserContext from "../../auth/UserContext";

// Mock functions for required props
const mockAddMovieToList = jest.fn();
const mockRemoveMovieFromList = jest.fn();

// Mock UserContext with addedMovies property
const mockUserContext = {
  addedMovies: [], // we can customize this value as needed for the test
};

// Provide the mock UserContext as a context value

describe("MovieList Component", () => {
  it("renders without crashing", () => {
     render(
       <UserContext.Provider value={mockUserContext}>
         <MovieList
           fetchData={MovieApi.getAllMoviesFromList}
           addMovieToList={mockAddMovieToList}
           removeMovieFromList={mockRemoveMovieFromList}
         />
       </UserContext.Provider>
     );
  
  });

  it("renders the title", () => {
    const { asFragment, getByText } = render(
      <UserContext.Provider value={mockUserContext}>
        <MovieList
          fetchData={MovieApi.getAllMoviesFromList}
          addMovieToList={mockAddMovieToList}
          removeMovieFromList={mockRemoveMovieFromList}
        />
      </UserContext.Provider>
    );
    expect(asFragment()).toMatchSnapshot();
    const titleElement = getByText("Here is your list");
    expect(titleElement).toBeInTheDocument();
  });
});
