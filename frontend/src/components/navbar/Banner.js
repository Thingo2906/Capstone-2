import React, { useContext, useEffect, useState } from "react";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";
import UserContext from "../../auth/UserContext";
import "./Banner.css";

// Component for making banner
function Banner({ fetchData, addMovieToList, removeMovieFromList }) {
  const { addedMovies } = useContext(UserContext);
  const [movie, setMovie] = useState([]);
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [trailerUrl, setTrailerUrl] = useState("");
  const [isTrailerVisible, setIsTrailerVisible] = useState(false);
  const [error, setError] = useState("");
  //const { hasAddedMovieToList } = useContext(UserContext);
  console.debug("addedMovies", addedMovies);

  useEffect(() => {
    async function getData() {
      let res = await fetchData();
      let random_movie =
        res.data.results[
          Math.floor(Math.random() * (res.data.results.length - 1))
        ];
      setMovie(random_movie);
      setUrl(random_movie.backdrop_path);
      setDescription(truncateString(random_movie.overview, 150));
    }
    getData();
  }, [fetchData]);

  function truncateString(str, num) {
    if (str.length > num) {
      return str.slice(0, num) + "...";
    } else {
      return str;
    }
  }

  const opts = {
    height: "350",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  function handleClick(movie, id) {
    if (trailerUrl || error) {
      setTrailerUrl("");
      setError("");
    } else {
      movieTrailer(movie, { tmdbId: id }).then((url) => {
        if (!url) {
          let movie_name = splitMovieName(movie);
          setError(
            `Link cannot find, please reach to https://www.themoviedb.org/search?query=${movie_name}`
          );
        }
        const urlParams = new URLSearchParams(new URL(url).search);
        setTrailerUrl(urlParams.get("v"));
        setIsTrailerVisible(true);
      });
    }
  }

  // Function to hide the trailer
  const handleRemoveTrailer = () => {
    setIsTrailerVisible(false);
  };

  function splitMovieName(name) {
    let arr = name.split(" ");
    return arr.join("-");
  }

  async function handleAdd(evt) {
    evt.preventDefault();
    await addMovieToList(movie.name ? movie.name : movie.title, movie.id);
  }

  async function handleRemove(evt) {
    evt.preventDefault();
    await removeMovieFromList(movie.id);
  }

  return (
    <>
      <header
        className="banner"
        style={{
          backgroundSize: "cover",
          backgroundImage: `url("http://image.tmdb.org/t/p/original/${url}")`,
          backgroundPosition: "center center",
        }}
      >
        <div className="banner-contents">
          <h1 className="banner-title">{movie.name}</h1>
          <div className="banner-buttons">
            <button
              className="banner-button"
              onClick={() => handleClick(movie.name, movie.id)}
            >
              Play
            </button>
            {addedMovies.some((addedMovie) => addedMovie[0] === movie.id) ? (
              <button className="banner-button-added" onClick={handleRemove}>
                Added
              </button>
            ) : (
              <button className="banner-button" onClick={handleAdd}>
                + My List
              </button>
            )}
          </div>
          <h1 className="banner-description">{description}</h1>
        </div>

        <div className="banner-fadebottom"></div>
      </header>

      {isTrailerVisible && trailerUrl && !error && (
        <>
          <YouTube videoId={trailerUrl} opts={opts}></YouTube>
          <button onClick={handleRemoveTrailer}>Close</button>
        </>
      )}
      {error && (
        <>
          <p className="error-msg">{error}</p>
        </>
      )}
    </>
  );
}
export default Banner;
