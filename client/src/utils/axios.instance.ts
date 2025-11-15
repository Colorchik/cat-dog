import axios from 'axios';

const getBaseURL = () => {
  // In production, use relative URL (same origin)
  // Rsbuild sets import.meta.env.MODE to 'production' in production builds
  if (import.meta.env.MODE === 'production') {
    return '/api/animals';
  }
  // In development, use the backend URL
  return 'http://localhost:6001/api/animals';
};

export const $api = axios.create({
   baseURL: getBaseURL(),
   withCredentials: true
});