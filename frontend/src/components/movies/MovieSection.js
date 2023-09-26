import React, { useState, useEffect } from "react";
import MovieApi from "../../api/api";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";
import MovieCardForSection from "./MovieCardForSection";
import ReviewSection from "../reviews/ReviewSection";
import "./MovieSection.css";

// We will drop fetchData, isLargeRow props from the parent Routes component.
// We alse drop addMovieToList, and removeMovieFromList props from the parent App component
function MovieSection({
  title,
  fetchData,
  isLargeRow,
  addMovieToList,
  removeMovieFromList

}) {
  const [movies, setMovies] = useState([]);
  const [trailerURL, setTrailerURL] = useState("");
  const [combineTrailerAndReview, setCombineTrailerAndReview] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [overview, setOverview] = useState("");
  const [error, setError] = useState(false);
  const [isOverviewVisible, setIsOverviewVisible] = useState(false);
  const [isTrailerVisible, setIsTrailerVisible] = useState(false);

  // Modify trailer display
  const opts = {
    height: "350",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  useEffect(() => {
    async function getMovies() {
      let res = await fetchData();
      setMovies(res.data.results);
      
    }
    getMovies();
  }, [fetchData]);
  // Handle click for play button
  // the overview will be hide when the trailer display
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
      movieTrailer(movie)
      .then((url) => {
        // if (!url) {
        //   let movie_name = splitMovieName(movie);
        //   setError(
        //     `Link cannot find, please reach to https://www.themoviedb.org/search?query=${movie_name}`
        //   );
        // }
        const urlParams = new URLSearchParams(new URL(url).search);
        setTrailerURL(urlParams.get("v"));
        setSelectedMovieId(id);
        setCombineTrailerAndReview(true);
        setIsTrailerVisible(true);
      })
      .catch((error) => {
        // Handle any other errors here (if needed)
        console.error("Error fetching trailer:", error);
        let movie_name = splitMovieName(movie);
        setError(
           `Link cannot find, please reach to https://www.themoviedb.org/search?query=${movie_name}`
         );
      })
      
    }
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
    setIsOverviewVisible(true); // Show overview when clicking on info
  }

  // Function to hide the trailer
  const handleRemoveTrailer = () => {
    setIsTrailerVisible(false);
  };

  // Function to hide the overview
  const handleRemoveOverview = () => {
    setIsOverviewVisible(false);
  };

  console.debug(movies);
  console.debug(selectedMovieId);

  return (
    <div className="movieList">
      <h2>{title}</h2>
      <div className="poster-list">
        {movies.map((movie) => (
          <MovieCardForSection
            key={movie.id}
            image={isLargeRow ? movie.poster_path : movie.backdrop_path}
            title={movie.name ? movie.name : movie.title}
            id={movie.id}
            isLargeRow={isLargeRow}
            handleClick={handleClick}
            addMovieToList={addMovieToList}
            removeMovieFromList={removeMovieFromList}
            handleInfo={handleInfo}
          />
        ))}
      </div>
      {combineTrailerAndReview && (
        <div className="combined-section">
          {isTrailerVisible && trailerURL && !error && (
            <>
              <YouTube videoId={trailerURL} opts={opts}></YouTube>
              <ReviewSection id={selectedMovieId} /> {/* Display reviews */}
              <button onClick={handleRemoveTrailer}>Close</button>
            </>
          )}
        </div>
      )}
      {error && (
        <>
          <p className="error-msg">{error}</p>
        </>
      )}

      {isOverviewVisible && overview ? (
        <>
          <p className="description-text">Overview: {overview} </p>
          <button onClick={handleRemoveOverview}>X</button>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
export default MovieSection;
