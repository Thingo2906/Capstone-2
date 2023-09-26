import React, {useContext} from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Banner from "../components/navbar/Banner"
import Homepage from "../components/homepage/Homepage";
import MovieSection from "../components/movies/MovieSection";
import MovieList from "../components/users/MovieList";
import LoginForm from "../components/users/LoginForm";
import SignupForm from "../components/users/SignUpForm";
import ProfileForm from "../components/users/ProfileForm";
import UserContext from "../auth/UserContext";
import SearchMovie from "../components/search/SearchMovie";
import MovieApi from "../api/api";
function AppRoutes({
  login,
  signUp,
  addMovieToList,
  removeMovieFromList,
  changeProfile,
}) {
  const { currentUser } = useContext(UserContext);
  console.debug("Routes", `login=${typeof login}`, `register=${typeof signUp}`);

  return (
    <Routes>
      {/* Unauthorized Routes  */}
      {!currentUser && (
        <>
          <Route path="/login" element={<LoginForm login={login} />} />
          <Route path="/signup" element={<SignupForm signUp={signUp} />} />
        </>
      )}
      <Route path="/homepage" element={<Homepage />} />

      {/* Authorized Routes  */}
      {currentUser && (
        <>
          <Route
            path="/movies"
            element={
              <>
                <Banner
                  fetchData={MovieApi.getNewRelease}
                  addMovieToList={addMovieToList}
                  removeMovieFromList={removeMovieFromList}
               
                />
                <MovieSection
                  key="Upcoming"
                  title="Upcoming"
                  fetchData={MovieApi.getUpcoming}
                  isLargeRow={true}
                  addMovieToList={addMovieToList}
                  removeMovieFromList={removeMovieFromList}
                
                ></MovieSection>
                <MovieSection
                  key="Trending"
                  title="Trending Now"
                  fetchData={MovieApi.getTrending}
                  isLargeRow={true}
                  addMovieToList={addMovieToList}
                  removeMovieFromList={removeMovieFromList}
                 
                ></MovieSection>
                <MovieSection
                  key="Top"
                  title="Top Rated"
                  fetchData={MovieApi.getTopRated}
                  isLargeRow={true}
                  addMovieToList={addMovieToList}
                  removeMovieFromList={removeMovieFromList}
               
                ></MovieSection>
                <MovieSection
                  key="Comedy"
                  title="Comedy Movies"
                  fetchData={MovieApi.getComedyMovies}
                  isLargeRow={true}
                  addMovieToList={addMovieToList}
                  removeMovieFromList={removeMovieFromList}
                 
                ></MovieSection>
                <MovieSection
                  key="Romantic"
                  title="Romantic Movies"
                  fetchData={MovieApi.getRomanticMovies}
                  isLargeRow={true}
                  addMovieToList={addMovieToList}
                  removeMovieFromList={removeMovieFromList}
                  
                ></MovieSection>
                <MovieSection
                  key="Documentaries"
                  title="Documentaries"
                  fetchData={MovieApi.getDocumentaries}
                  isLargeRow={true}
                  addMovieToList={addMovieToList}
                  removeMovieFromList={removeMovieFromList}
              
                ></MovieSection>
              </>
            }
          />
          <Route
            path="/mylist"
            element={
              <MovieList
                fetchData={MovieApi.getAllMoviesFromList}
                addMovieToList={addMovieToList}
                removeMovieFromList={removeMovieFromList}
              />
            }
          />

          <Route
            path="/search"
            element={
              <SearchMovie
                fetchData={MovieApi.getUpcoming}
                addMovieToList={addMovieToList}
                removeMovieFromList={removeMovieFromList}
              />
            }
          ></Route>

          <Route
            path="/profile"
            element={<ProfileForm changeProfile={changeProfile} />}
          />
        </>
      )}

      {/* All auth */}
      <Route path="*" element={<Navigate to="/homepage" />} />
    </Routes>
  );
}
export default AppRoutes;