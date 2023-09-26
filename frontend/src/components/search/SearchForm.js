import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "./SearchForm.css";

function SearchForm({ searchFor }) {
  const [searchTerm, setSearchTerm] = useState("");
  
  function handleChange(e) {
    e.persist();
    setSearchTerm(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    searchFor(searchTerm.trim() || undefined);
    setSearchTerm(searchTerm.trim());
  }

  return (
    <div>
      <form className="searchFrom">
        <div className="input-group">
          <input
            name="searchTerm"
            className="rounded"
            placeholder="Search"
            aria-label="Search"
            aria-describedby="search-addon"
            value={searchTerm}
            onChange={handleChange}
          />
          <span>
            <FontAwesomeIcon
              className="search-icon"
              icon={faSearch}
              type="Submit"
              onClick={handleSubmit}
            />
          </span>
        </div>
      </form>
    </div>
  );
}

export default SearchForm;
