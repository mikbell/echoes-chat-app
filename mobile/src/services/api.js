import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL - adjust this for your backend server
const BASE_URL = __DEV__ 
  ? 'http://192.168.1.95:5000/api'  // Development - usa IP del computer
  : 'https://your-production-url.com/api';  // Production

// Create axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, clear storage and redirect to login
      await AsyncStorage.multiRemove(['authToken', 'userData']);
      // You might want to emit an event here to force re-authentication
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authApi = {
  login: (data) => axiosInstance.post('/auth/login', data),
  signup: (data) => axiosInstance.post('/auth/signup', data),
  logout: () => axiosInstance.post('/auth/logout'),
  checkAuth: () => axiosInstance.get('/auth/check'),
  updateProfile: (data) => axiosInstance.put('/auth/update-profile', data),
};

// Messages API endpoints
export const messagesApi = {
  getUsers: () => axiosInstance.get('/messages/users'),
  getMessages: (userId) => axiosInstance.get(`/messages/${userId}`),
  sendMessage: (userId, data) => axiosInstance.post(`/messages/send/${userId}`, data),
};

export default axiosInstance;
