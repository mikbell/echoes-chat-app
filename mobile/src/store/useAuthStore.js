import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../services/api';
import { showToast } from '../utils/toast';
import socketService from '../services/socketService';

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isLoading: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      
      // Check if user token exists in AsyncStorage
      const token = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('userData');
      
      if (token && userData) {
        const user = JSON.parse(userData);
        set({ authUser: user });
        
        // Verify token with backend
        try {
          const response = await authApi.checkAuth();
          set({ authUser: response.data });
        } catch (error) {
          // Token expired or invalid
          await AsyncStorage.multiRemove(['authToken', 'userData']);
          set({ authUser: null });
        }
      }
    } catch (error) {
      console.log('Error checking auth:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    try {
      set({ isLoggingIn: true });
      
      const response = await authApi.login({ email, password });
      const { user, token } = response.data;
      
      // Store in AsyncStorage
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      
      set({ authUser: user });
      
      // Connect to Socket.io after successful login
      await socketService.connect(user._id);
      
      showToast('Login successful!', 'success');
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      showToast(message, 'error');
      return { success: false, message };
    } finally {
      set({ isLoggingIn: false });
    }
  },

  signup: async (fullName, email, password) => {
    try {
      set({ isSigningUp: true });
      
      const response = await authApi.signup({ fullName, email, password });
      const { user, token } = response.data;
      
      // Store in AsyncStorage
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      
      set({ authUser: user });
      showToast('Account created successfully!', 'success');
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      showToast(message, 'error');
      return { success: false, message };
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      // Call backend logout
      await authApi.logout();
    } catch (error) {
      console.log('Logout error:', error);
    } finally {
      // Disconnect Socket.io
      socketService.disconnect();
      
      // Clear local storage regardless
      await AsyncStorage.multiRemove(['authToken', 'userData']);
      set({ authUser: null });
      showToast('Logged out successfully', 'success');
    }
  },

  updateProfile: async (data) => {
    try {
      set({ isUpdatingProfile: true });
      
      const response = await authApi.updateProfile(data);
      const updatedUser = response.data;
      
      // Update AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      
      set({ authUser: updatedUser });
      showToast('Profile updated successfully!', 'success');
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      showToast(message, 'error');
      return { success: false, message };
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // Helper method to get current user
  getCurrentUser: () => get().authUser,
  
  // Helper method to check if user is authenticated
  isAuthenticated: () => !!get().authUser,
}));
