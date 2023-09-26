import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faMinus,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import "./MovieActionForList.css";

function MovieActionForList({
  id,
  name,
  handleClick,
  removeMovieFromList,
  handleInfo,
}) {
  async function handleRemove(evt) {
    evt.preventDefault();
    await removeMovieFromList(id);
  }

  return (
    <div className="action">
      <FontAwesomeIcon
        className="action-button"
        icon={faPlay}
        onClick={() => handleClick(name, id)}
        data-testid="play-button"
      />
      <FontAwesomeIcon
        className="action-button"
        icon={faMinus}
        onClick={handleRemove}
        data-testid="minus-button"
      />
      <FontAwesomeIcon
        className="action-button"
        icon={faCircleInfo}
        onClick={() => handleInfo(id)}
        data-testid="info-button"
      />
    </div>
  );
}
export default MovieActionForList;
