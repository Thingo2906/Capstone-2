import React, { useState } from "react";
import MovieAction from "./MovieAction";
import "./MovieCardForSection.css";

//We get this base_URL from the movie API to generate the image

const base_URL = "http://image.tmdb.org/t/p/original/";

function MovieCardForSection({
  id,
  image,
  title,
  isLargeRow,
  handleClick,
  addMovieToList,
  removeMovieFromList,
  handleInfo,
}) {
  // When user mouse over on the movie, it will show the movie Action.
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className={`MoviePoster ${isLargeRow ? "largePoster" : "smallPoster"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="MovieContainer">
        <img key={id} src={`${base_URL}${image}`} alt={title} />

        {isHovered ? (
          <MovieAction
            key={id}
            id={id}
            title={title}
            handleClick={handleClick}
            addMovieToList={addMovieToList}
            removeMovieFromList={removeMovieFromList}
            handleInfo={handleInfo}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
export default MovieCardForSection;
