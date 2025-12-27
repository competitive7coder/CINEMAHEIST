StreamHub - Full-Stack Movie Application

StreamHub is a modern, responsive web application built with the MERN stack (MongoDB, Express, React, Node.js) that mimics the experience of popular streaming services like Netflix or Prime Video. It allows users to discover movies, manage a personal watchlist, and maintain a user profile.

Features

User Authentication: Secure JWT-based user registration and login system.

Dynamic Homepage: A rich homepage featuring a cinematic hero slider and multiple horizontally-scrolling rows for different movie categories (Trending, Top 10, New Releases, Genres).

Movie Discovery:

Search: Functional search bar to find movies by title.

Genre Pages: Dedicated pages to view all movies belonging to a specific genre.

Movie Detail Pages: Rich pages showing a movie's poster, backdrop, synopsis, rating, year, runtime, cast, director, and related movies.

Interactive UI:

Trailer Modal: Click a "Watch Trailer" button to watch the official movie trailer in a pop-up modal.

Stylish Notifications: Non-blocking toast notifications for user actions (e.g., "Movie added to watchlist," "Logged out").

Personalized User Dashboard:

Tabbed Interface: Clean sidebar navigation for different sections.

Watchlist: View and remove movies from a personal watchlist.

Recommendations: A "For You" section suggesting movies based on the user's watchlist.

Viewing History: Automatically logs when a user adds a movie or watches a trailer.

Profile Management: Users can update their name, bio, password, and upload a profile picture.

Tech Stack

Backend (server)

Node.js: JavaScript runtime environment.

Express: Web framework for creating the API.

MongoDB: NoSQL database for storing user and activity data.

Mongoose: Object Data Modeling (ODM) for MongoDB.

JSON Web Token (JWT): For secure user authentication.

bcryptjs: For password hashing.

Axios: For making requests to the TMDb API.

dotenv: For managing environment variables.

cors: For enabling cross-origin requests.

cloudinary, multer, multer-storage-cloudinary: For handling image file uploads.

node-cache: For server-side caching of API responses.

Frontend (client)

React: JavaScript library for building the user interface.

React Router DOM: For client-side routing and navigation.

Axios: For making API requests to the backend server.

Bootstrap & React-Bootstrap: For responsive layout and UI components (Modals, Dropdowns).

Swiper.js: For creating the cinematic hero slider and movie row carousels.

react-icons: For including icons in the UI.

react-toastify: For stylish, non-blocking notifications.

You can now use the website!
