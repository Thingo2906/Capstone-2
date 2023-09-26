CREATE TABLE users (
    username VARCHAR(25) PRIMARY KEY,
    password TEXT NOT NULL,
    first_name VARCHAR(25) NOT NULL,
    last_name VARCHAR(25) NOT NULL,
    email TEXT NOT NULL CHECK (position ('@' IN email) > 1),
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create movieList table
CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    username VARCHAR(25) REFERENCES users(username) ON DELETE CASCADE, 
    movie_id INT NOT NULL,
    movie_name VARCHAR(100) NOT NULL
   

);

-- Create Reviews table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    username VARCHAR(25) REFERENCES users(username) ON DELETE CASCADE,
    movie_id INT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);