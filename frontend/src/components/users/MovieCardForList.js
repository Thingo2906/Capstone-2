import React, { useState } from "react";
import MovieActionForList from "./MovieActionForList";
import "./MovieCardForList.css"

//We get this base_URL from the movie API to generate the image
// We drop the movie props from the MovieList, isLargeRow from the Routes, showAction and handleClick from MovieCategory
// addMovieToList and removeMovieFromList from App component.
const base_URL = "http://image.tmdb.org/t/p/original/";
function MovieCardForList({
  id,
  name,
  image,
  isLargeRow,
  handleClick,
  addMovieToList,
  removeMovieFromList,
  handleInfo
}) {
  // When user mouse over on the movie, it will show the movie Action.
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className={`Poster ${isLargeRow ? "Large" : "small"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="movieTitle">{name}</div>
      <div className="movieBox">
        <img
          key={id}
          src={`${base_URL}${image}`}
          alt={name}
        ></img>
        {isHovered ? (
          <MovieActionForList
            key={id}
            id={id}
            name={name}
            handleClick={handleClick}
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
export default MovieCardForList;
