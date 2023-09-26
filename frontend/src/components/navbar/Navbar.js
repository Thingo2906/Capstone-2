import React, { useContext } from "react";

import { NavLink } from "react-router-dom";
import UserContext from "../../auth/UserContext";
import "./navbar.css";

function Navbar({ logout }) {
  const { currentUser } = useContext(UserContext);
  console.debug("Navbar", "currentUser=", currentUser);

  // The navbar when user logged In
  function loggedInNav() {
    return (
      <div className="nav">
        <div className="navbar-links-left">
          <ul className="navbar-links">
            <li>
              <NavLink className="nav-link" to="/movies">
                Movies
              </NavLink>
            </li>
            <li>
              <NavLink className="nav-link" to="/profile">
                Profile
              </NavLink>
            </li>
            <li>
              <NavLink className="nav-link" to="/mylist">
                MyList
              </NavLink>
            </li>
            <li>
              <NavLink className="nav-link" to="/search">
                Search
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="logout">
          <ul>
            <li>
              <NavLink className="nav-logout" to="/homepage" onClick={logout}>
                Log out {currentUser.username}
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    );
  }
  // The navbar when user logged out
  function loggedOutNav() {
    return (

      <ul className="navbar-links-right">
        <li>
          <NavLink className="nav-link" to="/login">
            Login
          </NavLink>
        </li>
        <li>
          <NavLink className="nav-link" to="/signup">
            Sign Up
          </NavLink>
        </li>
      </ul>
    );
  }

  // Remember to add a logo here
  return (
    <nav className="Navigation navbar navbar-expand-md">
      <NavLink to="/homepage" className="navbar-brand">
        <img className="nav-logo" src="../logo-png.png" alt="Movie Logo"></img>
      </NavLink>
      <div className="navbar-collapse">
        {currentUser ? <div className="logged-in-nav">{loggedInNav()}</div> : <div className="logged-out-nav">{loggedOutNav()}</div>}
      </div>
    </nav>
  );
}
export default Navbar;
