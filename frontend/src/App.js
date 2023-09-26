import MovieApi from "./api/api";
import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/Routes";
import useLocalStorage from "./hooks/useLocalStorage";
import UserContext from "./auth/UserContext";
import LoadingSpinner from "./support/LoadingSpinner";
import Navbar from "./components/navbar/Navbar";
import jwt from "jsonwebtoken";
import "./App.css";

// Create a key for local storage to store a token
export const TOKEN_STORAGE_ID = "movie-token";



function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [addedMovies, setAddedMovies] = useState([]);

  console.debug(
    "App",
    "infoLoaded=",
    infoLoaded,
    "currentUser=",
    currentUser,
    "token=",
    token
  );
  // need a useEffect will run whenever the app get a new token
  useEffect(
    function loadUserInfor() {
      async function getCurrentUser() {
        if (currentUser) {
          setInfoLoaded(true);
          return;
        }
        if (token) {
          await getUser(token);
        }
        setInfoLoaded(true);
      }
      setInfoLoaded(false);
      getCurrentUser();
      console.debug("App useEffect loadUserInfo", "token=", token);
    },
    [token, currentUser]
  );

  async function getUser(token) {
    try {
      // jwt.decode() will return a payload object which contain username.
      const { username } = jwt.decode(token);

      //update new token in the Api class for current user to call the API.
      MovieApi.token = token;

      // getCurrentUser is a method of MovieApi class not function of useEffect.
      let currentUser = await MovieApi.getCurrentUser(username);
      
      console.debug(currentUser);
      setCurrentUser(currentUser);
      setAddedMovies(currentUser.movie_list);

      //Convert movie_list array of arrays to array of objects.
      // const movieList = currentUser.movie_list.map(
      //   ([movie_id, movie_name]) => ({ movie_id, movie_name })
      // );

      // let movies = await MovieApi.searchDetailForMovieList(movieList);
      //Update the addedMovies state with array of objects
    } catch (err) {
      console.error("App loadUserInfo: problem loading", err);
      setCurrentUser(null);
    }
  }

  // Login and get token
  async function login(loginData) {
    try {
      let token = await MovieApi.login(loginData);
      setToken(token);
      await getUser(token);
      return { success: true };
    } catch (errors) {
      console.error("login failed", errors);
      return { success: false, errors };
    }
  }

  // Signup and get token
  async function signUp(signUpData) {
    try {
      let token = await MovieApi.signUp({ ...signUpData });
      setToken(token);
      await getUser(token);
      return { success: true };
    } catch (errors) {
      console.error("signup failed", errors);
      return { success: false, errors };
    }
  }

  // signout and value of token and currentUser will be null
  async function logout() {
    setCurrentUser(null);
    setToken(null);
  }

  // // Check did user add the movie to list?
  // function hasAddedMovieToList(id) {
  //   return addedMovies.some((movie) => movie.movie_id === id);
  // }

  // Adding a movie to the list
  async function addMovieToList(movie_name, movie_id) {
    try {
      // Make an API call to add the movie to the user's list
      let res = await MovieApi.addToMovieList(
        currentUser.username,
        movie_name,
        movie_id
      );
      // Create a new movie object with the added movie details

      // Update the addedMovies state with the new movie object
      setAddedMovies((prevMovies) => [
        ...prevMovies,
        [parseInt(res.movie_id), res.movie_name],
      ]);
      return { success: "Added Successfully!" };
    } catch (errors) {
      return { errors: errors };
    }
  }

  async function removeMovieFromList(movie_id) {
    try {
      // Make an API call to remove the movie from the user's list
      await MovieApi.removeFromMovieList(currentUser.username, movie_id);

      setAddedMovies(
        addedMovies.filter(
          (f) => JSON.stringify(f).indexOf(JSON.stringify(movie_id)) < 1
        )
      );

      // Update the addedMovies state by filtering out the removed movie

      return { success: "Removed Successfully!" };
    } catch (errors) {
      return { error: errors };
    }
  }

  async function changeProfile(username, data) {
    try {
      let user = MovieApi.updateProfile(username, data);
      setCurrentUser(user);
      return { success: "Update Successfuly!" };
    } catch (errors) {
      return { errors: errors };
    }
  }

  if (!infoLoaded) return <LoadingSpinner />;
  console.debug("My movie list", addedMovies);
  return (
    <BrowserRouter>
      <UserContext.Provider
        value={{
          currentUser,
          addedMovies,
          setCurrentUser
        }}
      >
        <div className="App">
          <Navbar logout={logout} />
          <AppRoutes
            login={login}
            signUp={signUp}
            addMovieToList={addMovieToList}
            removeMovieFromList={removeMovieFromList}
            changeProfile={changeProfile}
          />
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
