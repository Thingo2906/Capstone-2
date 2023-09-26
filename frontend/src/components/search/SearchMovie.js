import React, { useEffect, useState } from "react";
import MovieApi from "../../api/api";
import SearchForm from "./SearchForm";
import SearchMovieCard from "./SearchMovieCard";
import "./SearchMovie.css";



function SearchMovie({fetchData, addMovieToList, removeMovieFromList}){
    const [movies, setMovies] = useState ([]);

    useEffect(() => {
        async function getData() {
            let res = await fetchData();
            setMovies(res.data.results);
        }
        getData();
        }, [fetchData]);

 

    async function searchMovie(keyword) {
       let movies = await MovieApi.searchMovie(keyword);
       console.log(movies);
       setMovies(movies);
    }

    // // Handle click for play button
    // function handleClick(movie, id) {
    //    console.log("Clicked Movie ID:", id);
    //    setOverview("");
    //    setError("");
    //    if (trailerURL || error) {
    //       setTrailerURL("");
    //       setError("");
    //       setSelectedMovieId(id);
    //       setCombineTrailerAndReview(false);
    //    } else {
    //  //This function is used to fetch the trailer URL for the movie.
    //       movieTrailer(movie, { tmdbId: id }).then((url) => {
    //         if (!url) {
    //           let movie_name = splitMovieName(movie);
    //           setError(
    //             `Link cannot find, please reach to https://www.themoviedb.org/search?query=${movie_name}`
    //           );
    //         }
    //         const urlParams = new URLSearchParams(new URL(url).search);
    //         setTrailerURL(urlParams.get("v"));
    //         setSelectedMovieId(id);
    //         setCombineTrailerAndReview(true);
    //       });
    //     }
    // }
    
    // //Close a trailer
    // function handleCloseTrailer() {
    //    setTrailerURL("");
    //    setSelectedMovieId(null);
    //    setCombineTrailerAndReview(false);
    // }
    
    // // Adding a "-" between each word of movie_name for URL 
    // function splitMovieName(name) {
    //   let arr = name.split(" ");
    //   return arr.join("-");
    // }
 
    // // 
    // async function handleInfo(id) {
    //    setTrailerURL("");
    //    setError("");
    //    setSelectedMovieId(id); // Set the selected movie's ID
    //    setCombineTrailerAndReview(false); // Hide the combined section
    //    let res = await MovieApi.searchOverview(id);
    //    setOverview(res.overview);
    // }

    return (
      <div className="searchMovie">
        <SearchForm searchFor={searchMovie}></SearchForm>
        <div className="poster-list">
          {movies.map((movie) => (
            <SearchMovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              image={movie.backdrop_path}
              addMovieToList={addMovieToList}
              removeMovieFromList={removeMovieFromList}
          
         
            />
          ))}
        </div>
      
      </div>
    );
}
export default SearchMovie;
   
        