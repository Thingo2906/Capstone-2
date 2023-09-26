import React, { useState } from "react";
import MovieActionForSearch from "./MovieActionForSearch";
import YouTube from "react-youtube";
import ReviewSection from "../reviews/ReviewSection";
import MovieApi from "../../api/api";
import movieTrailer from "movie-trailer";
import "./SearchMovieCard.css";

//We get this base_URL from the movie API to generate the image

const base_URL = "http://image.tmdb.org/t/p/original/";

function SearchMovieCard({
  id,
  title,
  image,
  addMovieToList,
  removeMovieFromList,
}) {
  console.debug(
    id,
    title,
    image,
    addMovieToList,
    handleInfo,
    removeMovieFromList
  );
  // When user mouse over on the movie, it will show the movie Action.
  const [isHovered, setIsHovered] = useState(false);
  const [trailerURL, setTrailerURL] = useState("");
  const [combineTrailerAndReview, setCombineTrailerAndReview] = useState(false);
  const [overview, setOverview] = useState("");
  const [error, setError] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const opts = {
    height: "350",
    width: "80%",
    playerVars: {
      autoplay: 1,
    },
  };

  // Handle click for play button
  function handleClick(movie, id) {
    console.log("Clicked Movie ID:", id);
    setOverview("");
    setError("");
    if (trailerURL || error) {
      setTrailerURL("");
      setError("");
      setSelectedMovieId(id);
      setCombineTrailerAndReview(false);
    } else {
      //This function is used to fetch the trailer URL for the movie.
      movieTrailer(movie, { tmdbId: id }).then((url) => {
        if (!url) {
          let movie_name = splitMovieName(movie);
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

  // Adding a "-" between each word of movie_name for URL
  function splitMovieName(name) {
    let arr = name.split(" ");
    return arr.join("-");
  }

  //
  async function handleInfo(id) {
    setTrailerURL("");
    setError("");
    setSelectedMovieId(id); // Set the selected movie's ID
    setCombineTrailerAndReview(false); // Hide the combined section
    let res = await MovieApi.searchOverview(id);
    setOverview(res.overview);
  }

  return (
    <div
      className="search-movie-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="MovieContainer">
        <div>
          <h3 className="movie-text">{title}</h3>
          <img
            className="float-right ml-5"
            key={id}
            src={`${base_URL}${image}`}
            alt={title}
          />
          {isHovered ? (
            <MovieActionForSearch
              key={id}
              id={id}
              handleClick={handleClick}
              addMovieToList={addMovieToList}
              removeMovieFromList={removeMovieFromList}
              handleInfo={handleInfo}
            />
          ) : (
            <></>
          )}
        </div>
        <div>
          {combineTrailerAndReview && (
            <div className="combined-section">
              {trailerURL && !error && (
                <YouTube videoId={trailerURL} opts={opts}></YouTube>
              )}
              <ReviewSection id={selectedMovieId} /> {/* Display reviews */}
              <button
                className="close-trailer-button"
                onClick={handleCloseTrailer}
              >
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
              <p className="overview">Overview: {overview} </p>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
export default SearchMovieCard;
