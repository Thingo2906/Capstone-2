import React, { useContext, useState } from "react";
import UserContext from "../../auth/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPlus,
  faMinus,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import "./MovieActionForSearch.css";

function MovieAction({
  id,
  title,
  handleClick,
  addMovieToList,
  removeMovieFromList,
  handleInfo,
}) {
  const { addedMovies } = useContext(UserContext);
  const [addSuccessMsg, setAddSuccessMsg] = useState("");

  async function handleAdd(evt) {
    evt.preventDefault();
    setAddSuccessMsg("");
    let res = await addMovieToList(title, id);
    if (res["success"]) {
      setAddSuccessMsg(res["success"]);
    }
  }

  async function handleRemove(evt) {
    evt.preventDefault();
    setAddSuccessMsg("");
    await removeMovieFromList(id);
  }

  return (
    <div className="movie-action-for-search">
      <div className="movie-buttons">
        <FontAwesomeIcon
          className="icon"
          icon={faPlay}
          onClick={() => handleClick(title, id)}
        />
      </div>
      <div className="movie-buttons">
        {addedMovies.some((addedMovie) => addedMovie[0] === id) ||
        addSuccessMsg ? (
          <FontAwesomeIcon
            className="icon"
            icon={faMinus}
            onClick={handleRemove}
          />
        ) : (
          <FontAwesomeIcon className="icon" icon={faPlus} onClick={handleAdd} />
        )}
      </div>

      <div className="movie-buttons">
        <FontAwesomeIcon
          className="icon"
          icon={faCircleInfo}
          onClick={() => handleInfo(id)}
        />
      </div>
    </div>
  );
}
export default MovieAction;
