import axios from "axios";

const BASE_URL = import.meta.env.VITE_ENV === 'production'
  ? import.meta.env.VITE_APP_API_URL_PRO
  : import.meta.env.VITE_APP_API_URL_DEV;

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 200000, // Increased timeout to 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

// Add response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Add this to your API interceptors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    
    // Handle 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error('Server Error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

export default API;
