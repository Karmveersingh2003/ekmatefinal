import axios from 'axios';
import { toast } from 'react-toastify';

// API configuration
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:4000',
  API_PREFIX: '/ekmate/api/v1',
  TIMEOUT: 30000
};

// Create a custom axios instance with optimized configuration
const axiosInstance = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}`,
  withCredentials: false,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add a request interceptor to handle auth and errors
axiosInstance.interceptors.request.use(
  config => {
    // Only add Authorization header if token exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Remove any unnecessary headers
    delete config.headers['X-Requested-With'];

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // Extract the error message
    let errorMessage = 'An unexpected error occurred';

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.data) {
        if (error.response.data.err && error.response.data.err.message) {
          errorMessage = error.response.data.err.message;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      }

      // Handle token expiration
      if (error.response.status === 401) {
        // Clear stored tokens and redirect to login if token is invalid/expired
        localStorage.removeItem('token');

        // Only redirect if we're not already on the login page
        if (!window.location.pathname.includes('/signin')) {
          toast.error('Your session has expired. Please sign in again.');
          window.location.href = '/signin';
        }
      }

      // Show toast notification for errors (except on login/signup pages where we handle errors differently)
      if (!window.location.pathname.includes('/signin') && !window.location.pathname.includes('/signup')) {
        toast.error(errorMessage);
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response from server. Please check your connection.';
      toast.error(errorMessage);
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message || 'An unexpected error occurred';
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export { API_CONFIG };
export default axiosInstance;
