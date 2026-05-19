import axios from 'axios';

// Instantiate a standardized HTTP configuration client mapping directly to our backend server
const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  timeout: 10000, // Terminates connection safely if the network drops for more than 10 seconds
  headers: {
    'Content-Type': 'application/json'
  }
});

// Outgoing Request Interceptor: Auto-injects active JWT session tokens into outgoing requests
api.interceptors.request.use(
  (config) => {
    const activeToken = localStorage.getItem('devsync_auth_token');
    
    if (activeToken) {
      // Formats the header explicitly to match our backend protect middleware criteria
      config.headers.Authorization = `Bearer ${activeToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Incoming Response Interceptor: Catches security issues like expired tokens automatically
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If our server responds with a 401 Unauthorized, the token is invalid or expired
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('devsync_auth_token');
      // Force a clean reload to clear memory and redirect to the login card shell cleanly
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;