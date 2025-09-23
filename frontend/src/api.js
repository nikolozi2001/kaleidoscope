import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    config.metadata = { startTime: new Date() };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with retry logic
api.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const duration = new Date() - response.config.metadata.startTime;
    console.log(`API Request to ${response.config.url} took ${duration}ms`);
    
    // Handle the new API response format
    if (response.data && response.data.success) {
      return {
        ...response,
        data: response.data.data || response.data
      };
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Retry logic for network errors or 5xx errors
    if (
      (error.code === 'NETWORK_ERROR' || 
       error.code === 'ECONNABORTED' ||
       (error.response && error.response.status >= 500)) &&
      !originalRequest._retry &&
      originalRequest._retryCount < 3
    ) {
      originalRequest._retry = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      
      // Exponential backoff
      const delay = Math.pow(2, originalRequest._retryCount) * 1000;
      
      console.warn(`Retrying request to ${originalRequest.url} (attempt ${originalRequest._retryCount}) after ${delay}ms`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return api(originalRequest);
    }

    // Handle different types of errors
    let errorMessage = 'An unexpected error occurred';
    
    if (error.response) {
      // Server responded with error status
      const { data, status } = error.response;
      
      if (data && data.error && data.error.message) {
        errorMessage = data.error.message;
      } else if (status === 404) {
        errorMessage = 'Data not found for the requested parameters';
      } else if (status === 429) {
        errorMessage = 'Too many requests. Please try again later.';
      } else if (status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
    } else if (error.request) {
      // Network error
      errorMessage = 'Network error. Please check your connection.';
    }

    // Create a user-friendly error object
    const friendlyError = new Error(errorMessage);
    friendlyError.originalError = error;
    friendlyError.status = error.response?.status;
    
    return Promise.reject(friendlyError);
  }
);

// Helper function to handle API responses with loading states
export const withLoading = async (apiCall, setLoading, setError) => {
  try {
    setLoading?.(true);
    setError?.(null);
    const result = await apiCall();
    return result;
  } catch (error) {
    setError?.(error.message);
    throw error;
  } finally {
    setLoading?.(false);
  }
};

export default api;
