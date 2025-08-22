import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : window.location.origin;

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      if (import.meta.env.MODE === 'development') {
        console.log("Error in checkAuth:", error);
      }
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      if (import.meta.env.MODE === 'development') {
        console.log("Error in signup:", error);
      }
      
      // Handle different types of errors
      if (error.response) {
        const message = error.response.data?.message || "Signup failed";
        toast.error(message);
      } else if (error.request) {
        toast.error("Cannot connect to server. Please check if the backend is running.");
      } else {
        toast.error("An unexpected error occurred during signup");
      }
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      if (import.meta.env.MODE === 'development') {
        console.log("Error in login:", error);
      }
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with an error status
        const message = error.response.data?.message || "Login failed";
        toast.error(message);
      } else if (error.request) {
        // Network error or server not reachable
        toast.error("Cannot connect to server. Please check if the backend is running.");
      } else {
        // Something else happened
        toast.error("An unexpected error occurred during login");
      }
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      if (import.meta.env.MODE === 'development') {
        console.log("Error in logout:", error);
      }
      
      // Handle different types of errors
      if (error.response) {
        const message = error.response.data?.message || "Logout failed";
        toast.error(message);
      } else if (error.request) {
        toast.error("Cannot connect to server during logout");
      } else {
        toast.error("An unexpected error occurred during logout");
      }
      
      // Even if logout fails on server, clear local state
      set({ authUser: null });
      get().disconnectSocket();
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      if (import.meta.env.MODE === 'development') {
        console.log("error in update profile:", error);
      }
      const errorMessage = error.response?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
