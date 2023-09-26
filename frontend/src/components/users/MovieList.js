import React, { useState, useEffect, useContext } from "react";
import UserContext from "../../auth/UserContext";
import MovieApi from "../../api/api";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";
import MovieCardForList from "./MovieCardForList";
import ReviewSection from "../reviews/ReviewSection";
import "./MovieList.css";

// We will drop fetchData, isLargeRow props from the parent Routes component.
// We alse drop addMovieToList, and removeMovieFromList props from the parent App component
function MovieList({
  fetchData,
  isLargeRow,
  addMovieToList,
  removeMovieFromList,
}) {
  const { addedMovies } = useContext(UserContext);
  const [movies, setMovies] = useState([]);
  const [trailerURL, setTrailerURL] = useState("");
  const [combineTrailerAndReview, setCombineTrailerAndReview] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [overview, setOverview] = useState("");
  const [error, setError] = useState("");

  // OPTS object is used to configure the options for the YouTube video player
  const opts = {
    height: "350",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  //window.scrollTo(0, 0); is used to scroll the page to the top whenever the component mounts or updates.
  useEffect(() => {
    window.scrollTo(0, 0);
    async function getMovieFromList() {
      let all_movies = await fetchData(addedMovies);
      setMovies(all_movies); // now we get an array of movies
    }
    getMovieFromList();
  }, [fetchData, addedMovies]);

  // Handle click for play button
  // the overview will be hide when the trailer display
  function handleClick(name, id) {
    setOverview("");
    if (trailerURL || error) {
      setTrailerURL("");
      setError("");
      setSelectedMovieId(id);
      setCombineTrailerAndReview(false);
    } else {
      //This function is used to fetch the trailer URL for the movie.
      movieTrailer(name, { tmdbId: id }).then((url) => {
        if (!url) {
          let movie_name = splitMovieName(name);
          setError(
            `Link cannot find, please reach to https://www.themoviedb.org/search?query=${movie_name}`
          );
        }
        const urlParams = new URLSearchParams(new URL(url).search);
        setTrailerURL(urlParams.get("v"));
        setSelectedMovieId(id);
        setCombineTrailerAndReview(true);
      });
    }
  }

  //Close a trailer
  function handleCloseTrailer() {
    setTrailerURL("");
    setSelectedMovieId(null);
    setCombineTrailerAndReview(false);
  }

  // For the name from 2 word and more, we need to seperate each word with "-"(for above URL)
  function splitMovieName(name) {
    let arr = name.split(" ");
    return arr.join("-");
  }

  async function handleInfo(id) {
    setTrailerURL("");
    setError("");
    setSelectedMovieId(id); // Set the selected movie's ID
    setCombineTrailerAndReview(false); // Hide the combined section
    let res = await MovieApi.searchOverview(id);
    setOverview(res.overview);
  }

  return (
    <div className="movie-list">
      <h2>Here is your list</h2>
      <div className="poster">
        {movies.map((movie) => (
          <MovieCardForList
            key={movie.id}
            id={movie.id}
            image={isLargeRow ? movie.poster_path : movie.backdrop_path}
            name={movie.name ? movie.name : movie.title}
            handleClick={handleClick}
            isLargeRow={isLargeRow}
            removeMovieFromList={removeMovieFromList}
            handleInfo={handleInfo}
          />
        ))}
      </div>
      {combineTrailerAndReview && (
        <div className="combined-section">
          {trailerURL && !error && (
            <YouTube videoId={trailerURL} opts={opts}></YouTube>
          )}
          <ReviewSection key={selectedMovieId} id={selectedMovieId} />{" "}
          {/* Display reviews */}
          <button className="close-trailer-button" onClick={handleCloseTrailer}>
            Close Trailer
          </button>
        </div>
      )}

      {error && (
        <>
          <p className="error-msg">{error}</p>
        </>
      )}

      {overview ? (
        <>
          <p className="overview-text">Overview: {overview} </p>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
export default MovieList;
