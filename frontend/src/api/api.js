import axios from "axios";
//const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";
// Cloud
const BASE_URL = "https://movies-backend-o0cs.onrender.com";

// Api key for the movie data API
const API_KEY = process.env.REACT_APP_API_KEY;

// The movie data API
const base_URL = "https://api.themoviedb.org/3";
const new_release = `/discover/movie?api_key=${API_KEY}&include_adult=false&include_video=false&language=en-US&page=1&primary_release_year=2023&sort_by=popularity.desc`;
const trending = `/trending/all/week?api_key=${API_KEY}&language=en-US`;
const upcoming = `/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`;
const top_rated = `/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`;
const comedy_movies = `/discover/tv?api_key=${API_KEY}&with_genres=35`;
const romantic_movies = `/discover/tv?api_key=${API_KEY}&with_genres=10749`;
const documentaries = `/discover/tv?api_key=${API_KEY}&with_genres=99`;

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */
class MovieApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${MovieApi.token}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes
  /********FOR USER *********/

  /** Get the current user. */

  static async getCurrentUser(username) {
    let res = await this.request(`user/${username}`);
    return res.user;
  }

  //User login
  static async login(data) {
    let res = await this.request("auth/token", data, "post");
    return res.token;
  }

  // Register new user
  static async signUp(data) {
    let res = await this.request("auth/register", data, "post");
    return res.token;
  }

  //update the user profile
  static async updateProfile(username, data) {
    let res = await this.request(`user/${username}`, data, "patch");
    console.debug("usereswjhdb", res.user);
    return res.user;
  }

  /*********FOR MOVIE ******/

  //Adding movie to user's list
  static async addToMovieList(username, movie_name, movie_id) {
    let res = await this.request(
      `user/${username}/${movie_name}/${movie_id}/add`,
      {},
      "post"
    );
    console.debug(res);
    return res["added"];
  }

  // Remove movie from user's list
  static async removeFromMovieList(username, movie_id) {
    let res = await this.request(
      `user/${username}/${movie_id}/remove`,
      {},
      "delete"
    );
    return res["removed"];
  }

  /********FOR REVIEW *******/

  // Add a new review
  static async addReview(username, movie_id, comment) {
    let res = await this.request(
      `review/${username}/${movie_id}/add`,
      {
        comment,
      },
      "post"
    );
    return res.added;
  }

  //Get all reviews for a specific movie
  static async getReviewsForMovie(movie_id) {
    let res = await this.request(`review/${movie_id}`);
    return res.reviews;
  }

  // Get a specific review by username and movie_id
  // static async getReviewByUsernameAndMovieId(username, movie_id) {
  //   let res = await this.request(`reviews/${username}/${movie_id}`);
  //   return res.review;
  // }

  //Update a review
  static async updateReview(username, id, comment) {
    let res = await this.request(
      `review/${username}/${id}`,
      { comment },
      "patch"
    );
    return res.updatedReview;
  }

  //Delete a review
  static async deleteReview(username, id) {
    const res = await this.request(`review/${username}/${id}`, {}, "delete");
    return res["removed"];
  }

  /*********FETCH DATA FROM THE MOVIE DB API FOR MOVIE ************/

  // Get new_release
  static async getNewRelease() {
    let res = await axios.get(`${base_URL}${new_release}`);
    return res;
  }

  // Get all trending movies
  static async getTrending() {
    let res = await axios.get(`${base_URL}${trending}`);
    return res;
  }

  // Get upcoming movies
  static async getUpcoming() {
    let res = await axios.get(`${base_URL}${upcoming}`);
    return res;
  }

  // Get top rated movies
  static async getTopRated() {
    let res = await axios.get(`${base_URL}${top_rated}`);
    return res;
  }

  // Get comdy movies
  static async getComedyMovies() {
    let res = await axios.get(`${base_URL}${comedy_movies}`);
    return res;
  }

  // Get romantic movies
  static async getRomanticMovies() {
    let res = await axios.get(`${base_URL}${romantic_movies}`);
    return res;
  }

  // Get document movies
  static async getDocumentaries() {
    let res = await axios.get(`${base_URL}${documentaries}`);
    return res;
  }

  // For search Movie in search page
  static async searchMovie(keyword) {
    let res = await axios.get(
      `${base_URL}/search/multi?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1&include_adult=false`,
      { params: { query: keyword } }
    );
    return res.data.results;
  }

  //Search the overview for each movie
  static async searchOverview(id) {
    let res = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );
    return res.data;
  }

  static async searchDetail(id) {
    let res = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );
    return res.data;
  }

  // Search detail for ecah movie in my list
  // static async searchDetailForMovieList(movieArray){
  //   let movie_list = [];
  //   for (const movie of movieArray){
  //     let detailedMovie = await axios.get(
  //        `https://api.themoviedb.org/3/movie/${movie.movie_id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
  //      );
  //     if (detailedMovie && detailedMovie.id === movie.movie_id) {
  //        movie_list.push(detailedMovie);
  //     }

  //   }
  //   console.log("movie after fetch",movie_list);
  //   return movie_list;
  // }

  //Get all movies from user
  //And use the name of each movie to make a request to movie Api to get all information for that movie.

  static async getAllMoviesFromList(movieArray) {
    let all_movies = [];
    for (const movie of movieArray) {
      const detailedMovie = await MovieApi.searchDetail(movie[0]);
      if (detailedMovie && detailedMovie.id === movie[0]) {
        all_movies.push(detailedMovie);
      }
    }
    console.log("my movie:", all_movies);
    return all_movies;
  }
}

// for now, put token (name: "testuser1" / password: "testuser"/ email: "joel@joelburton.com") on class)
MovieApi.token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VyMSIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE2OTMyNzQzNDR9.dS72vkYPyrVnEHWsSk6x5rtkuUSjeUbkLhRYLokNffo";

export default MovieApi;
