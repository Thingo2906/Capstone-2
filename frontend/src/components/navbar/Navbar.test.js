import React from "react";
import Navbar from "./Navbar";
import UserContext from "../../auth/UserContext";
import {render} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { hasUncaughtExceptionCaptureCallback } from "process";
mockLogout = jest.fn();

describe("Navbar Component", function(){
    test("render without crashing", function(){
        const currentUser ={};
        render(
        <BrowserRouter> 
        <UserContext.Provider value={{ currentUser }}>
          <Navbar logout={mockLogout} />
        </UserContext.Provider>
        </BrowserRouter> )        
    });
    test("matches Snapshot", function(){
        const currentUser = {};
        const { asFragment } = render(
          <BrowserRouter>
            <UserContext.Provider value={{ currentUser }}>
              <Navbar logout={mockLogout} />
            </UserContext.Provider>
          </BrowserRouter>
        ); 
        expect(asFragment()).toMatchSnapshot();
    })
    test("renders Navbar when user is logged in", function(){
        const currentUser = {username: "testuser"};
        const {getByText} = render(
          <BrowserRouter>
            <UserContext.Provider value={{ currentUser }}>
              <Navbar logout={mockLogout} />
            </UserContext.Provider>
          </BrowserRouter>
        ); 
        expect(getByText("Movies")).toBeInTheDocument();
        expect(getByText("Profile")).toBeInTheDocument();
        expect(getByText("MyList")).toBeInTheDocument();
        expect(getByText("Search")).toBeInTheDocument();
    });

  test('renders Navbar when user is logged out', () => {
    const currentUser = null;
    const {getByText} = render(
         <BrowserRouter>
            <UserContext.Provider value={{ currentUser }}>
              <Navbar logout={mockLogout} />
            </UserContext.Provider>
          </BrowserRouter>
      
    );
    expect(getByText("Login")).toBeInTheDocument();
    expect(getByText("Sign Up")).toBeInTheDocument();
  });
    
})