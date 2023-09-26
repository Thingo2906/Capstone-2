import React from "react";
import { render } from "@testing-library/react";
import MovieSection from "./MovieSection";
import MovieApi from "../../api/api";




describe("MovieSection Component", () => {
    // We can change the fetchData for different category of movie
  it("renders without crashing", () => {
    render(<MovieSection fetchData={MovieApi.getUpcoming} />);
  });
  it("renders the title", () => {
     const { asFragment, getByText } = render(<MovieSection title="Upcoming" fetchData={MovieApi.getUpcoming} />);
     expect(asFragment()).toMatchSnapshot();
     const titleElement = getByText("Upcoming");
     expect(titleElement).toBeInTheDocument();
   });


})



