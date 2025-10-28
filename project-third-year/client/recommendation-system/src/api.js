// src/api.js
import axios from 'axios';

// 1. Get the API URL from the environment variable
const API_URL = process.env.REACT_APP_API_URL;

// 2. Create a new 'instance' of axios with the base URL
const api = axios.create({
  baseURL: API_URL
});

// 3. (Optional but recommended)
// This will automatically add the user's login token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // or wherever you store it
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;