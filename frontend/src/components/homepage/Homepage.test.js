import React from "react";
import Homepage from "./Homepage";
import { render} from "@testing-library/react";
import UserContext from "../../auth/UserContext";

describe("Homepage component", function(){
    test("render without crashing", function(){
        const currentUser = {};

        render(
          <UserContext.Provider value={{ currentUser }}>
            <Homepage />
          </UserContext.Provider>
        );
    });
    test("Matches snapshot", function(){
        const currentUser = {};
        const { asFragment } = render(
          <UserContext.Provider value={{ currentUser }}>
            <Homepage />
          </UserContext.Provider>
        );
        expect(asFragment()).toMatchSnapshot();
    });
    test("renders Homepage when user logged in", function(){
        const currentUser={ username: "testuser", firstName: "test", lastName: "user"};
        const { getByText } = render(
          <UserContext.Provider value={{ currentUser }}>
            <Homepage />
          </UserContext.Provider>
        );
        expect(getByText(`Welcome back! ${currentUser.firstName}`)).toBeInTheDocument();
    });
})