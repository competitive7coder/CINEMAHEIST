import axios from 'axios';

// 1. Get the API URL from the environment variable
const API_URL = process.env.REACT_APP_API_URL;

// 2. Create a new 'instance' of axios with the base URL
const api = axios.create({
  baseURL: API_URL
});

// 3. This interceptor now adds the CORRECT 'x-auth-token' header
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // or wherever you store it
  if (token) {
    // Instead of 'Authorization', we use 'x-auth-token'
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export default api;

