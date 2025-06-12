import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import {toast} from 'react-hot-toast';
export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  checkAuth: async() => {
    try {
      const response = await axiosInstance.get('/auth/check');
      set({authUser: response.data})
    } catch (error) {
      set({authUser: null});
      console.error("Error checking authentication:", error);
    }finally {
      set({isCheckingAuth: false});
    }
  },
  signup: async (data) =>{
    set({isSigningUp: true});
    try {
      const res = await axiosInstance.post('/auth/signup', data);
      console.log("Signup response:", res.data);
      toast.success('Account created successfully');
      set({authUser: res.data});
    } catch (error) {
      toast.error(error.response.data.message);
    }finally{
      set({isSigningUp: false});
    }
  },
  login: async(data) => {
    set({isLoggingIn: true});
    try {
      const res = await axiosInstance.post('/auth/login', data);
      console.log("Login response:", res.data);
      toast.success('Logged in successfully');
      set({authUser: res.data});
    } catch (error) {
      toast.error(error.response.data.message || 'Login failed');
    }finally {
      set({isLoggingIn: false});
    }
  },
  logout: async() => {
    try {
      await axiosInstance.post('/auth/logout');
      set({authUser: null});
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
      console.error("Error logging out:", error);
    }
  },
  uploadProfile: async (data) => {
    set({isUpdatingProfile: true});
    try {
      const res = await axiosInstance.put('/auth/update-profile', data);
      set({authUser: res.data});
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error('Profile update failed');
    }finally {
      set({isUpdatingProfile: false});
    }
  },
}))