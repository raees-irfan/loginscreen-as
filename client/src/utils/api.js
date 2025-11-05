import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Helper function to get headers with auth token
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  const token = localStorage.getItem('token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

// API functions using normal axios calls
const api = {
  get: async (url, config = {}) => {
    try {
      const response = await axios.get(`${BASE_URL}${url}`, {
        ...config,
        headers: getHeaders(),
      });
      return response;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  post: async (url, data, config = {}) => {
    try {
      const response = await axios.post(`${BASE_URL}${url}`, data, {
        ...config,
        headers: getHeaders(),
      });
      return response;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  put: async (url, data, config = {}) => {
    try {
      const response = await axios.put(`${BASE_URL}${url}`, data, {
        ...config,
        headers: getHeaders(),
      });
      return response;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  delete: async (url, config = {}) => {
    try {
      const response = await axios.delete(`${BASE_URL}${url}`, {
        ...config,
        headers: getHeaders(),
      });
      return response;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
};

// Handle errors including 401 token expiration
const handleError = (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};

export default api;

