import React from "react";
import Banner from "./Banner";
import MovieApi from "../../api/api";

import UserContext from "../../auth/UserContext";
import { render } from "@testing-library/react";

// Mock functions for required props
const mockAddMovieToList = jest.fn();
const mockRemoveMovieFromList = jest.fn();
const mockFetchData = jest.fn();


// Mock UserContext with addedMovies property
const mockUserContext = {
  addedMovies: [], // we can customize this value as needed for the test
};

describe("Banner Component", function(){
    test("renders without crashing", () => {
        mockFetchData.mockResolvedValue({
            data: {
              results: [
                {
                  id: 1,
                  name: "Movie Name",
                  backdrop_path: "sample-image.jpg",
                  overview: "Movie overview...",
                },
              ],
            },
          });
  

         render(
            <UserContext.Provider value={mockUserContext}>
              <Banner
                fetchData={mockFetchData}
                addMovieToList={mockAddMovieToList}
                removeMovieFromList={mockRemoveMovieFromList}
              />
            </UserContext.Provider>
        );
    });
    test("matches snapshot", function () {
      mockFetchData.mockResolvedValue({
         data: {
           results: [
             {
               id: 1,
               name: "Movie Name",
               backdrop_path: "sample-image.jpg",
               overview: "Movie overview...",
             },
           ],
         },
       });
      const { asFragment } = render(
        <UserContext.Provider value={mockUserContext}>
          <Banner
            fetchData={mockFetchData}
            addMovieToList={mockAddMovieToList}
            removeMovieFromList={mockRemoveMovieFromList}
          />
        </UserContext.Provider>
      );
      expect(asFragment()).toMatchSnapshot();
    });
    
  });
