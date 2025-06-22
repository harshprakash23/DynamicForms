import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Ensure this matches your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Add timeout to prevent hanging requests
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.debug('Request:', {
        url: config.url,
        method: config.method,
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      console.warn('No token found in localStorage for request:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.debug('Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('API error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    if (error.response?.status === 401) {
      console.warn('Unauthorized request, clearing token');
      localStorage.removeItem('token');
      window.location.href = '/login'; // Redirect to login on 401
    }
    return Promise.reject(error);
  }
);

export default api;